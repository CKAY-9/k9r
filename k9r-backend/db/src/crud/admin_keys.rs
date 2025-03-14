use diesel::{query_dsl::methods::FindDsl, ExpressionMethods, RunQueryDsl};

use crate::{
    create_connection,
    models::{AdminKey, NewAdminKey},
    schema::admin_keys,
};

pub fn create_admin_key(admin_key: NewAdminKey) -> Option<AdminKey> {
    let connection = &mut create_connection();
    let insert = diesel::insert_into(admin_keys::table)
        .values(admin_key)
        .get_result::<AdminKey>(connection);

    match insert {
        Ok(result) => Some(result),
        Err(_e) => None,
    }
}

pub fn get_admin_key_from_id(id: i32) -> Option<AdminKey> {
    let connection = &mut create_connection();
    let find = admin_keys::table.find(id).first(connection);

    match find {
        Ok(result) => Some(result),
        Err(_e) => None,
    }
}

pub fn update_admin_key_from_id(id: i32, admin_key: NewAdminKey) -> Option<AdminKey> {
    let connection = &mut create_connection();
    let update = diesel::update(admin_keys::table)
        .filter(admin_keys::id.eq(id))
        .set(admin_key)
        .get_result::<AdminKey>(connection);

    match update {
        Ok(result) => Some(result),
        Err(_e) => None,
    }
}

pub fn delete_admin_key_from_id(id: i32) -> bool {
    let connection = &mut create_connection();
    let delete = diesel::delete(admin_keys::table)
        .filter(admin_keys::id.eq(id))
        .execute(connection);

    match delete {
        Ok(_result) => true,
        Err(_e) => false,
    }
}

pub fn delete_all_admin_keys() -> bool {
    let connection = &mut create_connection();
    let delete = diesel::delete(admin_keys::table)
        .execute(connection);

    match delete {
        Ok(_result) => true,
        Err(_e) => false,
    }
}
