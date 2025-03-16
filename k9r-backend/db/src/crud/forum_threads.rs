use diesel::{
    query_dsl::methods::{FilterDsl, FindDsl},
    ExpressionMethods, RunQueryDsl,
};

use crate::{
    create_connection,
    models::{ForumThread, NewForumThread},
    schema::forum_threads,
};

pub fn create_forum_thread(forum_thread: NewForumThread) -> Option<ForumThread> {
    let connection = &mut create_connection();
    let insert = diesel::insert_into(forum_threads::table)
        .values(forum_thread)
        .get_result::<ForumThread>(connection);

    match insert {
        Ok(result) => Some(result),
        Err(_e) => None,
    }
}

pub fn get_all_forum_threads() -> Vec<ForumThread> {
    let connection = &mut create_connection();
    match forum_threads::table.load(connection) {
        Ok(ts) => ts,
        Err(_e) => {
            vec![]
        }
    }
}

pub fn get_forum_threads_from_user_id(user_id: i32) -> Vec<ForumThread> {
    let connection = &mut create_connection();
    match forum_threads::table
        .filter(forum_threads::author.eq(user_id))
        .load::<ForumThread>(connection)
    {
        Ok(ts) => ts,
        Err(_e) => vec![],
    }
}

pub fn get_threads_in_forum_topic(topic_id: i32) -> Vec<ForumThread> {
    let connection = &mut create_connection();
    match forum_threads::table
        .filter(forum_threads::topic.eq(topic_id))
        .load(connection)
    {
        Ok(ts) => ts,
        Err(_e) => {
            vec![]
        }
    }
}

pub fn get_forum_thread_from_id(id: i32) -> Option<ForumThread> {
    let connection = &mut create_connection();
    let find = forum_threads::table.find(id).first(connection);

    match find {
        Ok(result) => Some(result),
        Err(_e) => None,
    }
}

pub fn update_forum_thread_from_id(id: i32, forum_thread: NewForumThread) -> Option<ForumThread> {
    let connection = &mut create_connection();
    let update = diesel::update(forum_threads::table)
        .filter(forum_threads::id.eq(id))
        .set(forum_thread)
        .get_result::<ForumThread>(connection);

    match update {
        Ok(result) => Some(result),
        Err(_e) => None,
    }
}

pub fn delete_forum_thread_from_id(id: i32) -> bool {
    let connection = &mut create_connection();
    let delete = diesel::delete(forum_threads::table)
        .filter(forum_threads::id.eq(id))
        .execute(connection);

    match delete {
        Ok(_result) => true,
        Err(_e) => false,
    }
}
