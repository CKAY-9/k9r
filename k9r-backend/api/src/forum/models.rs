use k9r_db::models::{NewForumPost, NewForumThread};
use serde::Deserialize;

#[derive(Deserialize)]
pub struct NewThread {
    pub new_thread: NewForumThread,
    pub new_post: NewForumPost
} 