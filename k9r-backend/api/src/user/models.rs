use serde::{Deserialize, Serialize};

#[derive(Deserialize)]
pub struct UserOAuth {
    pub code: String
}

#[derive(Deserialize, Debug)]
pub struct DiscordInitial {
    pub token_type: String,
    pub access_token: String,
}

#[derive(Deserialize)]
pub struct DiscordUser {
    pub global_name: String,
    pub avatar: String,
    pub id: String,
}

#[derive(Deserialize)]
pub struct GithubInitial {
    pub access_token: String,
    pub token_type: String,
    pub scope: String,
}

#[derive(Deserialize)]
pub struct GithubUser {
    pub login: String,
    pub avatar_url: String,
    pub id: u64,
}

#[derive(Serialize)]
pub struct UserCount {
    pub users: usize
}