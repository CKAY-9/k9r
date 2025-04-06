use diesel::{
    query_dsl::methods::{FilterDsl, FindDsl},
    ExpressionMethods, RunQueryDsl,
};

use crate::{
    create_connection,
    models::{NewSupportTicket, SupportTicket},
    schema::support_tickets,
};

pub fn create_support_ticket(support_ticket: NewSupportTicket) -> Option<SupportTicket> {
    let connection = &mut create_connection();
    let insert = diesel::insert_into(support_tickets::table)
        .values(support_ticket)
        .get_result::<SupportTicket>(connection);

    match insert {
        Ok(result) => Some(result),
        Err(_e) => None,
    }
}

pub fn get_support_ticket_from_id(id: i32) -> Option<SupportTicket> {
    let connection = &mut create_connection();
    let find = support_tickets::table.find(id).first(connection);

    match find {
        Ok(result) => Some(result),
        Err(_e) => None,
    }
}

pub fn get_all_support_tickets() -> Vec<SupportTicket> {
    let connection = &mut create_connection();
    match support_tickets::table.load::<SupportTicket>(connection) {
        Ok(tickets) => tickets,
        Err(_e) => vec![],
    }
}

pub fn get_all_user_support_tickets(user_id: i32) -> Vec<SupportTicket> {
    let connection = &mut create_connection();
    match support_tickets::table
        .filter(support_tickets::creator.eq(user_id))
        .load::<SupportTicket>(connection)
    {
        Ok(tickets) => tickets,
        Err(_e) => vec![],
    }
}

pub fn update_support_ticket_from_id(
    id: i32,
    support_ticket: NewSupportTicket,
) -> Option<SupportTicket> {
    let connection = &mut create_connection();
    let update = diesel::update(support_tickets::table)
        .filter(support_tickets::id.eq(id))
        .set(support_ticket)
        .get_result::<SupportTicket>(connection);

    match update {
        Ok(result) => Some(result),
        Err(_e) => None,
    }
}

pub fn delete_support_ticket_from_id(id: i32) -> bool {
    let connection = &mut create_connection();
    let delete = diesel::delete(support_tickets::table)
        .filter(support_tickets::id.eq(id))
        .execute(connection);

    match delete {
        Ok(_result) => true,
        Err(_e) => false,
    }
}
