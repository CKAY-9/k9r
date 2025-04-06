use diesel::{query_dsl::methods::{FilterDsl, FindDsl}, ExpressionMethods, RunQueryDsl};

use crate::{
    create_connection,
    models::{NewSupportTicketReply, SupportTicketReply},
    schema::support_ticket_replies,
};

pub fn create_support_ticket_reply(
    support_ticket_reply: NewSupportTicketReply,
) -> Option<SupportTicketReply> {
    let connection = &mut create_connection();
    let insert = diesel::insert_into(support_ticket_replies::table)
        .values(support_ticket_reply)
        .get_result::<SupportTicketReply>(connection);

    match insert {
        Ok(result) => Some(result),
        Err(_e) => None,
    }
}

pub fn get_support_ticket_reply_from_id(id: i32) -> Option<SupportTicketReply> {
    let connection = &mut create_connection();
    let find = support_ticket_replies::table.find(id).first(connection);

    match find {
        Ok(result) => Some(result),
        Err(_e) => None,
    }
}

pub fn get_support_ticket_replies_from_support_ticket_id(id: i32) -> Vec<SupportTicketReply> {
    let connection = &mut create_connection();
    match support_ticket_replies::table
        .filter(support_ticket_replies::support_ticket.eq(id))
        .load::<SupportTicketReply>(connection) {
        Ok(replies) => replies,
        Err(_e) => vec![]
    }
}

pub fn update_support_ticket_reply_from_id(
    id: i32,
    support_ticket_reply: NewSupportTicketReply,
) -> Option<SupportTicketReply> {
    let connection = &mut create_connection();
    let update = diesel::update(support_ticket_replies::table)
        .filter(support_ticket_replies::id.eq(id))
        .set(support_ticket_reply)
        .get_result::<SupportTicketReply>(connection);

    match update {
        Ok(result) => Some(result),
        Err(_e) => None,
    }
}

pub fn delete_support_ticket_reply_from_id(id: i32) -> bool {
    let connection = &mut create_connection();
    let delete = diesel::delete(support_ticket_replies::table)
        .filter(support_ticket_replies::id.eq(id))
        .execute(connection);

    match delete {
        Ok(_result) => true,
        Err(_e) => false,
    }
}
