use std::vec;

use diesel::{
    query_dsl::methods::{FilterDsl, FindDsl},
    ExpressionMethods, RunQueryDsl,
};

use crate::{
    create_connection,
    models::{ForumPost, NewForumPost},
    schema::forum_posts,
};

pub fn create_forum_post(forum_post: NewForumPost) -> Option<ForumPost> {
    let connection = &mut create_connection();
    let insert = diesel::insert_into(forum_posts::table)
        .values(forum_post)
        .get_result::<ForumPost>(connection);

    match insert {
        Ok(result) => Some(result),
        Err(_e) => None,
    }
}

pub fn get_forum_post_from_id(id: i32) -> Option<ForumPost> {
    let connection = &mut create_connection();
    let find = forum_posts::table.find(id).first(connection);

    match find {
        Ok(result) => Some(result),
        Err(_e) => None,
    }
}

pub fn get_all_forum_posts() -> Vec<ForumPost> {
    let connection = &mut create_connection();
    match forum_posts::table.load(connection) {
        Ok(posts) => posts,
        Err(_e) => vec![]
    }
}

pub fn get_forum_posts_from_user_id(user_id: i32) -> Vec<ForumPost> {
    let connection = &mut create_connection();
    match forum_posts::table
        .filter(forum_posts::author.eq(user_id))
        .load::<ForumPost>(connection)
    {
        Ok(ps) => ps,
        Err(_e) => vec![],
    }
}

pub fn get_forum_posts_in_forum_thread(id: i32) -> Vec<ForumPost> {
    let connection = &mut create_connection();
    match forum_posts::table
        .filter(forum_posts::thread.eq(id))
        .load(connection)
    {
        Ok(posts) => posts,
        Err(_e) => vec![],
    }
}

pub fn update_forum_post_from_id(id: i32, forum_post: NewForumPost) -> Option<ForumPost> {
    let connection = &mut create_connection();
    let update = diesel::update(forum_posts::table)
        .filter(forum_posts::id.eq(id))
        .set(forum_post)
        .get_result::<ForumPost>(connection);

    match update {
        Ok(result) => Some(result),
        Err(_e) => None,
    }
}

pub fn delete_forum_post_from_id(id: i32) -> bool {
    let connection = &mut create_connection();
    let delete = diesel::delete(forum_posts::table)
        .filter(forum_posts::id.eq(id))
        .execute(connection);

    match delete {
        Ok(_result) => true,
        Err(_e) => false,
    }
}
