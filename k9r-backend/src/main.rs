use std::time::SystemTime;

use actix_cors::Cors;
use actix_web::{App, HttpServer};
use dotenvy::dotenv;
use k9r_api::{configure_api, permissions::{CREATE_NEW_POSTS, CREATE_NEW_THREADS, DEFAULT_COMMUNITY_ACCESS, EDIT_POSTS, EDIT_PROFILE, EDIT_THREADS, ROOT_ACCESS}};
use k9r_db::{
    crud::{
        community_details::{create_community_details, get_community_details_from_id},
        usergroups::{create_usergroup, get_usergroup_from_id},
        users::{create_user, get_user_from_oauth_id},
    },
    models::{NewCommunityDetails, NewUser, NewUsergroup},
};
use k9r_utils::iso8601;
use rand::Rng;
use sha2::{Digest, Sha256};

fn generate_community_details() {
    let existing_community_details = get_community_details_from_id(1);
    match existing_community_details {
        Some(details) => {
            println!(
                "Community details already initialized. Starting with {}.",
                details.name
            );
        }
        None => {
            let initial_details: NewCommunityDetails = NewCommunityDetails {
                name: "K9-Revive".to_string(),
                description: "An absolute overhaul to K9-Forums. The perfect website.".to_string(),
                icon: "/icon.png".to_string(),
                banner: "/wikimedia_commons_backgorund.gif".to_string(),
            };

            let insert = create_community_details(initial_details);
            match insert {
                Some(result) => {
                    println!(
                        "Created default community details. Continuing with default {}",
                        result.name
                    );
                }
                None => {
                    panic!("Failed to create community details! Ensure this backend is connected to your PostgreSQL database!");
                }
            }
        }
    }
}

fn generate_user_usergroup() {
    let user_usergroup = get_usergroup_from_id(1);
    match user_usergroup {
        Some(_usergroup) => {
            println!("Default user usergroup already initialized.")
        }
        None => {
            let new_user_usergroup: NewUsergroup = NewUsergroup {
                name: "User".to_string(),
                color: "#fff".to_string(),
                icon: "".to_string(),
                permissions: CREATE_NEW_THREADS
                    | CREATE_NEW_POSTS
                    | EDIT_POSTS
                    | EDIT_THREADS
                    | EDIT_PROFILE
                    | DEFAULT_COMMUNITY_ACCESS,
            };

            let insert = create_usergroup(new_user_usergroup);
            match insert {
                Some(result) => {
                    println!("Created default user usergroup. ID: {}", result.id);
                }
                None => {
                    panic!("Failed to create default user usergroup! Ensure this backend is connected to your PostgreSQL database!");
                }
            }
        }
    }
}

fn generate_root_usergroup() {
    let root_usergroup = get_usergroup_from_id(2);
    match root_usergroup {
        Some(_usergroup) => {
            println!("Default root usergroup already initialized.")
        }
        None => {
            let new_root_usergroup: NewUsergroup = NewUsergroup {
                name: "Root".to_string(),
                color: "#ff0000".to_string(),
                icon: "".to_string(),
                permissions: ROOT_ACCESS,
            };

            let insert = create_usergroup(new_root_usergroup);
            match insert {
                Some(result) => {
                    println!("Created default root usergroup. ID: {}", result.id);
                }
                None => {
                    panic!("Failed to create default root usergroup! Ensure this backend is connected to your PostgreSQL database!");
                }
            }
        }
    }
}

fn generate_admin_user() {
    match get_user_from_oauth_id(String::from("root-root-user")) {
        Some(user) => {
            println!("Root user already created. Current token: {}. Go to \"/admin/root\" to sign in with it.", user.token)
        }
        None => {
            let mut rng = rand::rng();
            let random_one: f64 = rng.random();
            let random_two: f64 = rng.random();
            let random_three: f64 = rng.random();
            let random_four: f64 = rng.random();
            let mut hasher = Sha256::new();
            hasher.update(
                format!(
                    "{}{}{}{}{}",
                    "root-root-user",
                    random_one * 100_000_000_000f64,
                    random_two * 100_000_000_000f64,
                    random_three * 100_000_000_000f64,
                    random_four * 100_000_000_000f64
                )
                .into_bytes(),
            );
            let user_token: String = format!("{:X}", hasher.finalize()).to_string();
            let new_user = NewUser {
                token: user_token.clone(),
                username: "Root".to_string(),
                display_name: "Root".to_string(),
                description: "No description provided.".to_string(),
                joined: iso8601(&SystemTime::now()),
                oauth_type: "root-root-user".to_string(),
                followers: vec![],
                following: vec![],
                usergroups: vec![1, 2],
                reputation: 0,
                avatar: format!(""),
                banner: "".to_string(),
            };

            match create_user(new_user) {
                Some(user) => {
                    println!("Created root user. Current token: {}. Go to \"/admin/root\" to sign in with it.", user.token);
                }
                None => {
                    panic!("Failed to create root user! Ensure this backend is connected to your PostgreSQL database!")
                }
            }
        }
    }
}

fn initialize_k9r() {
    generate_community_details();
    generate_user_usergroup();
    generate_root_usergroup();
    generate_admin_user();
}

#[actix_web::main]
async fn main() -> std::io::Result<()> {
    dotenv().ok();

    initialize_k9r();

    HttpServer::new(|| {
        let cors = Cors::permissive();

        App::new().wrap(cors).configure(configure_api)
    })
    .bind(("0.0.0.0", 8080))?
    .run()
    .await
}
