use k9r_db::models::{NewForumPost, NewForumThread};
use serde::{Deserialize, Serialize};

#[derive(Deserialize)]
pub struct NewThread {
    pub new_thread: NewForumThread,
    pub new_post: NewForumPost
} 

#[derive(Serialize)]
pub struct ThreadCount {
    pub threads: usize
}

#[derive(Serialize)]
pub struct PostCount {
    pub posts: usize
}

#[derive(Deserialize)]
pub struct Like {
    pub state: i32
}