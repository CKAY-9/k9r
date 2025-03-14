use std::{time::SystemTime, vec};

use actix_web::{
    get,
    web::{self, Redirect},
    HttpRequest, HttpResponse, Responder,
};
use k9r_db::{
    crud::{
        usergroups::get_usergroup_from_id,
        users::{
            create_user, get_all_users, get_user_from_id, get_user_from_oauth_id, get_user_from_token, search_users_with_page, update_user_from_id
        },
    },
    models::{NewUser, User, Usergroup},
};
use k9r_utils::{extract_header_value, get_env_var, get_local_api_url, iso8601};
use rand::Rng;
use sha2::{Digest, Sha256};

use crate::{
    models::Message,
    user::models::{DiscordInitial, DiscordUser, GithubInitial, GithubUser, SearchUser, UserCount, UserOAuth},
};

#[get("/discord")]
pub async fn login_with_discord(
    query: web::Query<UserOAuth>,
) -> Result<Redirect, Box<dyn std::error::Error>> {
    let client = reqwest::Client::new();
    let inital_response = client
        .post("https://discord.com/api/oauth2/token")
        .form(&[
            ("client_id", get_env_var("K9R_DISCORD_OAUTH_ID")),
            ("client_secret", get_env_var("K9R_DISCORD_OAUTH_SECRET")),
            ("code", query.code.to_string()),
            ("grant_type", "authorization_code".to_string()),
            ("redirect_uri", get_local_api_url() + "/user/discord"),
        ])
        .header("Content-Type", "application/x-www-form-urlencoded")
        .send()
        .await?;
    let inital_response_parsed =
        serde_json::from_str::<DiscordInitial>(inital_response.text().await?.as_str())?;
    let user_response = client
        .get("https://discord.com/api/v10/users/@me")
        .header(
            "Authorization",
            format!("Bearer {}", inital_response_parsed.access_token),
        )
        .send()
        .await?;
    if user_response.status() != 200 {
        return Ok(Redirect::to(format!(
            "{}/user/login?msg=ue",
            get_env_var("K9R_FRONTEND_HOST")
        ))
        .permanent());
    }

    let user_response_parsed: DiscordUser =
        serde_json::from_str::<DiscordUser>(user_response.text().await?.as_str())?;

    let oauth: String = format!("discord-{}", user_response_parsed.id).to_string();
    let user_option: Option<User> = get_user_from_oauth_id(oauth.clone());
    // Check if a user already exists with OAuth provider
    if user_option.is_some() {
        let mut user = user_option.unwrap();
        user.avatar = format!(
            "https://cdn.discordapp.com/avatars/{}/{}",
            user_response_parsed.id, user_response_parsed.avatar
        );
        user.username = user_response_parsed.global_name;
        let update: NewUser =
            serde_json::from_str(serde_json::to_string(&user).unwrap().as_str()).unwrap();
        let _ = update_user_from_id(user.id, update);

        return Ok(Redirect::to(format!(
            "{}/user/login?token={}",
            get_env_var("K9R_FRONTEND_HOST"),
            user.token
        )));
    }

    let mut rng = rand::rng();
    let random_number: f64 = rng.random();
    let mut hasher = Sha256::new();
    hasher.update(
        format!(
            "{}{}",
            user_response_parsed.id,
            random_number * 100_000_000_000f64
        )
        .into_bytes(),
    );
    let user_token: String = format!("{:X}", hasher.finalize()).to_string();
    let new_user = NewUser {
        token: user_token.clone(),
        username: user_response_parsed.global_name.clone(),
        display_name: user_response_parsed.global_name,
        description: "No description provided.".to_string(),
        joined: iso8601(&SystemTime::now()),
        oauth_type: oauth,
        followers: vec![],
        following: vec![],
        usergroups: vec![1],
        reputation: 0,
        avatar: format!(
            "https://cdn.discordapp.com/avatars/{}/{}",
            user_response_parsed.id, user_response_parsed.avatar
        ),
        banner: "".to_string(),
    };
    let _insert: Option<User> = create_user(new_user);
    Ok(Redirect::to(format!(
        "{}/user/login?token={}",
        get_env_var("K9R_FRONTEND_HOST"),
        user_token
    ))
    .permanent())
}

#[get("/github")]
pub async fn login_with_github(
    query: web::Query<UserOAuth>,
) -> Result<Redirect, Box<dyn std::error::Error>> {
    let client = reqwest::Client::new();
    let initial_token_response = client
        .post("https://github.com/login/oauth/access_token")
        .form(&[
            ("code", query.code.to_owned()),
            ("client_id", get_env_var("K9R_GITHUB_OAUTH_ID")),
            ("client_secret", get_env_var("K9R_GITHUB_OAUTH_SECRET")),
        ])
        .header("accept", "application/json")
        .send()
        .await?;
    let initial_response_parsed: GithubInitial =
        serde_json::from_str::<GithubInitial>(initial_token_response.text().await?.as_str())?;
    let user_response = client
        .get("https://api.github.com/user")
        .header(
            "Authorization",
            format!(
                "{} {}",
                initial_response_parsed.token_type, initial_response_parsed.access_token
            ),
        )
        .header("accept", "application/vnd.github+json")
        .header("user-agent", "request")
        .send()
        .await?;
    if user_response.status() != 200 {
        return Ok(Redirect::to(format!(
            "{}/user/login?msg=ue",
            get_env_var("K9R_FRONTEND_HOST")
        ))
        .permanent());
    }
    let user_response_parsed: GithubUser =
        serde_json::from_str::<GithubUser>(user_response.text().await?.as_str())?;
    let oauth = format!("github-{}", user_response_parsed.id);
    let user: Option<User> = get_user_from_oauth_id(oauth.clone());

    if user.is_some() {
        let mut user_unwrap = user.unwrap();
        user_unwrap.avatar = user_response_parsed.avatar_url.clone();
        user_unwrap.username = user_response_parsed.login;
        let update: NewUser =
            serde_json::from_str(serde_json::to_string(&user_unwrap).unwrap().as_str()).unwrap();
        let _ = update_user_from_id(user_unwrap.id, update);

        return Ok(Redirect::to(format!(
            "{}/user/login?token={}",
            get_env_var("K9R_FRONTEND_HOST"),
            user_unwrap.token
        )));
    }

    let mut rng = rand::rng();
    let random_number: f64 = rng.random();
    let mut hasher = Sha256::new();
    hasher.update(
        format!(
            "{}{}",
            user_response_parsed.id,
            random_number * 100_000_000_000f64
        )
        .into_bytes(),
    );
    let user_token: String = format!("{:X}", hasher.finalize()).to_string();
    let new_user = NewUser {
        token: user_token.clone(),
        username: user_response_parsed.login.clone(),
        display_name: user_response_parsed.login,
        description: "No description provided.".to_string(),
        joined: iso8601(&SystemTime::now()),
        oauth_type: oauth,
        followers: vec![],
        following: vec![],
        usergroups: vec![1],
        reputation: 0,
        avatar: user_response_parsed.avatar_url.clone(),
        banner: "".to_string(),
    };
    let _insert = create_user(new_user);
    Ok(Redirect::to(format!(
        "{}/user/login?token={}",
        get_env_var("K9R_FRONTEND_HOST"),
        user_token
    )))
}

#[get("")]
pub async fn get_personal_user(
    request: HttpRequest,
) -> Result<impl Responder, Box<dyn std::error::Error>> {
    let token_option = extract_header_value(&request, "Authorization");
    if token_option.is_none() {
        return Ok(HttpResponse::BadRequest().json(Message {
            message: "Failed to get user token".to_string(),
        }));
    }

    let token = token_option.unwrap();
    let user = get_user_from_token(token);
    match user {
        Some(u) => Ok(HttpResponse::Ok().json(u)),
        None => Ok(HttpResponse::NotFound().json(Message {
            message: "Failed to get user".to_string(),
        })),
    }
}

#[get("/{id}")]
pub async fn get_user_by_id(
    path: web::Path<(i32,)>,
) -> Result<impl Responder, Box<dyn std::error::Error>> {
    let user_id = path.into_inner().0;
    let user = get_user_from_id(user_id);
    match user {
        Some(mut u) => {
            u.token = String::from("");
            Ok(HttpResponse::Ok().json(u))
        }
        None => Ok(HttpResponse::NotFound().json(Message {
            message: "Failed to get user".to_string(),
        })),
    }
}

#[get("/{id}/usergroups")]
pub async fn get_user_usergroups_by_id(
    path: web::Path<(i32,)>,
) -> Result<impl Responder, Box<dyn std::error::Error>> {
    let user_id = path.into_inner().0;
    let user_option = get_user_from_id(user_id);
    if user_option.is_none() {
        return Ok(HttpResponse::NotFound().json(Message {
            message: "Failed to get user".to_string(),
        }));
    }

    let user = user_option.unwrap();
    let mut fetched_usergroups: Vec<Usergroup> = Vec::new();
    for id in user.usergroups.iter() {
        let usergroup_option = get_usergroup_from_id(*id);
        if usergroup_option.is_none() {
            continue;
        }

        fetched_usergroups.push(usergroup_option.unwrap());
    }

    Ok(HttpResponse::Ok().json(fetched_usergroups))
}

#[get("/count")]
pub async fn get_user_count() -> Result<impl Responder, Box<dyn std::error::Error>> {
    let users = get_all_users();
    Ok(HttpResponse::Ok().json(UserCount {
        users: users.len()
    }))
}

#[get("/search")]
pub async fn user_search(
    query: web::Query<SearchUser>
) -> Result<impl Responder, Box<dyn std::error::Error>> {
    let query_results = search_users_with_page(query.search.clone(), query.page as i64);
    Ok(HttpResponse::Ok().json(query_results))
}