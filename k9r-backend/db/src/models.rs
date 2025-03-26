use diesel::{prelude::{AsChangeset, Insertable, Queryable}, Selectable};
use serde::{Deserialize, Serialize};

#[derive(Queryable, Selectable, Serialize, Deserialize, Debug, Clone)]
#[diesel(table_name = crate::schema::users)]
#[diesel(check_for_backend(diesel::pg::Pg))]
pub struct User {
    pub id: i32,
    pub token: String,
    pub username: String,
    pub display_name: String,
    pub description: String,
    pub joined: String,
    pub oauth_type: String,
    pub followers: Vec<i32>,
    pub following: Vec<i32>,
    pub usergroups: Vec<i32>,
    pub reputation: i32,
    pub avatar: String,
    pub banner: String
}

#[derive(Insertable, AsChangeset, Deserialize, Serialize)]
#[diesel(table_name = crate::schema::users)]
pub struct NewUser {
    pub token: String,
    pub username: String,
    pub display_name: String,
    pub description: String,
    pub joined: String,
    pub oauth_type: String,
    pub followers: Vec<i32>,
    pub following: Vec<i32>,
    pub usergroups: Vec<i32>,
    pub reputation: i32,
    pub avatar: String,
    pub banner: String
}

#[derive(Queryable, Selectable, Serialize, Deserialize, Debug)]
#[diesel(table_name = crate::schema::community_details)]
#[diesel(check_for_backend(diesel::pg::Pg))]
pub struct CommunityDetails {
    pub id: i32,
    pub name: String,
    pub description: String,
    pub icon: String,
    pub banner: String
}

#[derive(Insertable, AsChangeset, Deserialize, Serialize)]
#[diesel(table_name = crate::schema::community_details)]
pub struct NewCommunityDetails {
    pub name: String,
    pub description: String,
    pub icon: String,
    pub banner: String
}

#[derive(Queryable, Selectable, Serialize, Deserialize, Debug)]
#[diesel(table_name = crate::schema::usergroups)]
#[diesel(check_for_backend(diesel::pg::Pg))]
pub struct Usergroup {
    pub id: i32,
    pub name: String,
    pub color: String,
    pub icon: String,
    pub permissions: i32
}

#[derive(Insertable, AsChangeset, Deserialize, Serialize)]
#[diesel(table_name = crate::schema::usergroups)]
pub struct NewUsergroup {
    pub name: String,
    pub color: String,
    pub icon: String,
    pub permissions: i32
}

#[derive(Queryable, Selectable, Serialize, Deserialize, Debug)]
#[diesel(table_name = crate::schema::forum_sections)]
#[diesel(check_for_backend(diesel::pg::Pg))]
pub struct ForumSection {
    pub id: i32,
    pub name: String,
    pub description: String,
    pub icon: String,
    pub color: String,
    pub topics: Vec<i32>,
    pub sort_order: i32
}

#[derive(Insertable, AsChangeset, Deserialize, Serialize)]
#[diesel(table_name = crate::schema::forum_sections)]
pub struct NewForumSection {
    pub name: String,
    pub description: String,
    pub icon: String,
    pub color: String,
    pub topics: Vec<i32>,
    pub sort_order: i32
}

#[derive(Queryable, Selectable, Serialize, Deserialize, Debug, Clone)]
#[diesel(table_name = crate::schema::forum_topics)]
#[diesel(check_for_backend(diesel::pg::Pg))]
pub struct ForumTopic {
    pub id: i32,
    pub name: String,
    pub description: String,
    pub icon: String,
    pub color: String,
    pub section: i32,
    pub threads: Vec<i32>
}

#[derive(Insertable, AsChangeset, Deserialize, Serialize, Clone)]
#[diesel(table_name = crate::schema::forum_topics)]
pub struct NewForumTopic {
    pub name: String,
    pub description: String,
    pub icon: String,
    pub color: String,
    pub section: i32,
    pub threads: Vec<i32>
}

#[derive(Queryable, Selectable, Serialize, Deserialize, Debug)]
#[diesel(table_name = crate::schema::forum_threads)]
#[diesel(check_for_backend(diesel::pg::Pg))]
pub struct ForumThread {
    pub id: i32,
    pub title: String,
    pub author: i32,
    pub created: String,
    pub updated: String,
    pub likes: Vec<i32>,
    pub dislikes: Vec<i32>,
    pub primary_post: i32,
    pub posts: Vec<i32>,
    pub topic: i32,
    pub locked: bool,
    pub sticky: bool
}

#[derive(Insertable, AsChangeset, Deserialize, Serialize)]
#[diesel(table_name = crate::schema::forum_threads)]
pub struct NewForumThread {
    pub title: String,
    pub author: i32,
    pub created: String,
    pub updated: String,
    pub likes: Vec<i32>,
    pub dislikes: Vec<i32>,
    pub primary_post: i32,
    pub posts: Vec<i32>,
    pub topic: i32,
    pub locked: bool,
    pub sticky: bool
}

#[derive(Queryable, Selectable, Serialize, Deserialize, Debug)]
#[diesel(table_name = crate::schema::forum_posts)]
#[diesel(check_for_backend(diesel::pg::Pg))]
pub struct ForumPost {
    pub id: i32,
    pub author: i32,
    pub content: String,
    pub json_content: String,
    pub created: String,
    pub updated: String,
    pub likes: Vec<i32>,
    pub dislikes: Vec<i32>,
    pub thread: i32
}

#[derive(Insertable, AsChangeset, Deserialize, Serialize)]
#[diesel(table_name = crate::schema::forum_posts)]
pub struct NewForumPost {
    pub author: i32,
    pub content: String,
    pub json_content: String,
    pub created: String,
    pub updated: String,
    pub likes: Vec<i32>,
    pub dislikes: Vec<i32>,
    pub thread: i32
}

#[derive(Queryable, Selectable, Serialize, Deserialize, Debug)]
#[diesel(table_name = crate::schema::admin_keys)]
#[diesel(check_for_backend(diesel::pg::Pg))]
pub struct AdminKey {
    pub id: i32,
    pub permissions: i32,
    pub key: String,
    pub expires: String
}

#[derive(Insertable, AsChangeset, Deserialize, Serialize)]
#[diesel(table_name = crate::schema::admin_keys)]
pub struct NewAdminKey {
    pub permissions: i32,
    pub key: String,
    pub expires: String
}

#[derive(Queryable, Selectable, Serialize, Deserialize, Debug, Clone)]
#[diesel(table_name = crate::schema::game_servers)]
#[diesel(check_for_backend(diesel::pg::Pg))]
pub struct GameServer {
    pub id: i32,
    pub name: String,
    pub description: String,
    pub game: String,
    pub server_key: String,
    pub host_address: String,
    pub latest_state: String
}

#[derive(Insertable, AsChangeset, Deserialize, Serialize)]
#[diesel(table_name = crate::schema::game_servers)]
pub struct NewGameServer {
    pub name: String,
    pub description: String,
    pub game: String,
    pub server_key: String,
    pub host_address: String,
    pub latest_state: String
}