use std::vec;

use diesel::{ExpressionMethods, PgTextExpressionMethods, QueryDsl, RunQueryDsl};

use crate::{create_connection, models::{User, NewUser}, schema::users};

pub fn create_user(user: NewUser) -> Option<User> {
    let connection = &mut create_connection();
    let insert = diesel::insert_into(users::table)
        .values(user)
        .get_result::<User>(connection);

    match insert {
        Ok(result) => {
            Some(result)
        }
        Err(_e) => {
            None
        }
    }
}

pub fn get_user_from_id(id: i32) -> Option<User> {
    let connection = &mut create_connection();
    let find = users::table
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

pub fn get_user_from_oauth_id(oauth_id: String) -> Option<User> {
    let connection = &mut create_connection();
    let find = users::table
        .filter(users::oauth_type.eq(oauth_id))
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

pub fn get_user_from_token(token: String) -> Option<User> {
    let connection = &mut create_connection();
    let find = users::table
        .filter(users::token.eq(token))
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

pub fn get_all_users() -> Vec<User> {
    let connection = &mut create_connection();
    let users = users::table.load(connection);
    match users {
        Ok(us) => {
            us
        }
        Err(_e) => {
            vec![]
        }
    }
}

pub fn search_users_with_page(search: String, page: i64) -> Vec<User> {
    let connection = &mut create_connection();

    let per_page = 20;
    let offset = (page - 1) * 20;

    let users = users::table
        .filter(users::username.ilike(format!("%{}%", search)))
        .limit(per_page)
        .offset(offset as i64)
        .load::<User>(connection);
    
    match users {
        Ok(us) => {
            us
        }
        Err(_e) => {
            vec![]
        }
    }
}

pub fn update_user_from_id(id: i32, user: NewUser) -> Option<User> {
    let connection = &mut create_connection();
    let update = diesel::update(users::table)
        .filter(users::id.eq(id))
        .set(user)
        .get_result::<User>(connection);

    match update {
        Ok(result) => {
            Some(result)
        }
        Err(_e) => {
            None
        }
    }
}

pub fn delete_user_from_id(id: i32) -> bool {
    let connection = &mut create_connection();
    let delete = diesel::delete(users::table)
        .filter(users::id.eq(id))
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