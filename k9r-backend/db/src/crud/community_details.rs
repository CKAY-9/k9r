use diesel::{query_dsl::methods::FindDsl, ExpressionMethods, RunQueryDsl};

use crate::{create_connection, models::{CommunityDetails, NewCommunityDetails}, schema::community_details};

pub fn create_community_details(community_details: NewCommunityDetails) -> Option<CommunityDetails> {
    let connection = &mut create_connection();
    let insert = diesel::insert_into(community_details::table)
        .values(community_details)
        .get_result::<CommunityDetails>(connection);

    match insert {
        Ok(result) => {
            Some(result)
        }
        Err(_e) => {
            None
        }
    }
}

pub fn get_community_details_from_id(id: i32) -> Option<CommunityDetails> {
    let connection = &mut create_connection();
    let find = community_details::table
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

pub fn update_community_details_from_id(id: i32, community_details: NewCommunityDetails) -> Option<CommunityDetails> {
    let connection = &mut create_connection();
    let update = diesel::update(community_details::table)
        .filter(community_details::id.eq(id))
        .set(community_details)
        .get_result::<CommunityDetails>(connection);

    match update {
        Ok(result) => {
            Some(result)
        }
        Err(_e) => {
            None
        }
    }
}

pub fn delete_community_details_from_id(id: i32) -> bool {
    let connection = &mut create_connection();
    let delete = diesel::delete(community_details::table)
        .filter(community_details::id.eq(id))
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