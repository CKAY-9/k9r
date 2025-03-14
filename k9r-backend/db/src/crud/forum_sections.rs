use diesel::{query_dsl::methods::FindDsl, ExpressionMethods, RunQueryDsl};

use crate::{create_connection, models::{ForumSection, NewForumSection}, schema::forum_sections};

pub fn create_forum_section(forum_section: NewForumSection) -> Option<ForumSection> {
    let connection = &mut create_connection();
    let insert = diesel::insert_into(forum_sections::table)
        .values(forum_section)
        .get_result::<ForumSection>(connection);

    match insert {
        Ok(result) => {
            Some(result)
        }
        Err(_e) => {
            None
        }
    }
}

pub fn get_forum_section_from_id(id: i32) -> Option<ForumSection> {
    let connection = &mut create_connection();
    let find = forum_sections::table
        .find(id)
        .first(connection);

    match find {
        Ok(result) => {
            Some(result)
        }
        Err(_e) => {
            None
        }
    }
}

pub fn get_all_forum_sections() -> Vec<ForumSection> {
    let connection = &mut create_connection();
    let sections = forum_sections::table.load(connection);
    match sections {
        Ok(s) => {
            s
        },
        Err(_e) => {
            vec![]
        }
    }
}

pub fn update_forum_section_from_id(id: i32, forum_section: NewForumSection) -> Option<ForumSection> {
    let connection = &mut create_connection();
    let update = diesel::update(forum_sections::table)
        .filter(forum_sections::id.eq(id))
        .set(forum_section)
        .get_result::<ForumSection>(connection);

    match update {
        Ok(result) => {
            Some(result)
        }
        Err(_e) => {
            None
        }
    }
}

pub fn delete_forum_section_from_id(id: i32) -> bool {
    let connection = &mut create_connection();
    let delete = diesel::delete(forum_sections::table)
        .filter(forum_sections::id.eq(id))
        .execute(connection);

    match delete {
        Ok(_result) => {
            true
        }
        Err(_e) => {
            false
        }
    }
}