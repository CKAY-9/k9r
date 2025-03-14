use diesel::{query_dsl::methods::FindDsl, ExpressionMethods, RunQueryDsl};

use crate::{create_connection, models::{Usergroup, NewUsergroup}, schema::usergroups};

pub fn create_usergroup(usergroup: NewUsergroup) -> Option<Usergroup> {
    let connection = &mut create_connection();
    let insert = diesel::insert_into(usergroups::table)
        .values(usergroup)
        .get_result::<Usergroup>(connection);

    match insert {
        Ok(result) => {
            Some(result)
        }
        Err(_e) => {
            None
        }
    }
}

pub fn get_usergroup_from_id(id: i32) -> Option<Usergroup> {
    let connection = &mut create_connection();
    let find = usergroups::table
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

pub fn update_usergroup_from_id(id: i32, usergroup: NewUsergroup) -> Option<Usergroup> {
    let connection = &mut create_connection();
    let update = diesel::update(usergroups::table)
        .filter(usergroups::id.eq(id))
        .set(usergroup)
        .get_result::<Usergroup>(connection);

    match update {
        Ok(result) => {
            Some(result)
        }
        Err(_e) => {
            None
        }
    }
}

pub fn delete_usergroup_from_id(id: i32) -> bool {
    let connection = &mut create_connection();
    let delete = diesel::delete(usergroups::table)
        .filter(usergroups::id.eq(id))
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