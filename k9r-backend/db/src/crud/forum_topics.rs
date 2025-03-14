use diesel::{query_dsl::methods::{FilterDsl, FindDsl}, ExpressionMethods, RunQueryDsl};

use crate::{
    create_connection,
    models::{ForumTopic, NewForumTopic},
    schema::forum_topics,
};

pub fn create_forum_topic(forum_topic: NewForumTopic) -> Option<ForumTopic> {
    let connection = &mut create_connection();
    let insert = diesel::insert_into(forum_topics::table)
        .values(forum_topic)
        .get_result::<ForumTopic>(connection);

    match insert {
        Ok(result) => Some(result),
        Err(_e) => None,
    }
}

pub fn get_forum_topic_from_id(id: i32) -> Option<ForumTopic> {
    let connection = &mut create_connection();
    let find = forum_topics::table.find(id).first(connection);

    match find {
        Ok(result) => Some(result),
        Err(_e) => None,
    }
}

pub fn get_forum_topics_from_section(section_id: i32) -> Vec<ForumTopic> {
    let connection = &mut create_connection();
    
    match forum_topics::table
    .filter(forum_topics::section.eq(section_id))
    .load::<ForumTopic>(connection) {
        Ok(topics) => topics,
        Err(_e) => vec![]
    }
}

pub fn get_all_forum_topics() -> Vec<ForumTopic> {
    let connection = &mut create_connection();
    let topics = forum_topics::table.load(connection);
    match topics {
        Ok(s) => {
            s
        },
        Err(_e) => {
            vec![]
        }
    }
}


pub fn update_forum_topic_from_id(id: i32, forum_topic: NewForumTopic) -> Option<ForumTopic> {
    let connection = &mut create_connection();
    let update = diesel::update(forum_topics::table)
        .filter(forum_topics::id.eq(id))
        .set(forum_topic)
        .get_result::<ForumTopic>(connection);

    match update {
        Ok(result) => Some(result),
        Err(_e) => None,
    }
}

pub fn delete_forum_topic_from_id(id: i32) -> bool {
    let connection = &mut create_connection();
    let delete = diesel::delete(forum_topics::table)
        .filter(forum_topics::id.eq(id))
        .execute(connection);

    match delete {
        Ok(_result) => true,
        Err(_e) => false,
    }
}
