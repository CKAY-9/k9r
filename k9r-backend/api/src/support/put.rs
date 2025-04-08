use std::time::SystemTime;

use actix_web::{web, HttpMessage, HttpRequest, HttpResponse};
use k9r_db::{crud::support_tickets::{get_support_ticket_from_id, update_support_ticket_from_id}, models::{NewSupportTicket, User}};
use k9r_utils::iso8601;

use crate::models::Message;

pub async fn toggle_ticket_completed(
    (request, path): (HttpRequest, web::Path<(i32,)>)
) -> HttpResponse {
    let _user = match request.extensions().get::<User>().cloned() {
        Some(user) => user,
        None => {
            return HttpResponse::Unauthorized().json(Message {
                message: "Failed to get user".to_string(),
            })
        }
    };

    let ticket_id = path.into_inner().0;
    let ticket_option = get_support_ticket_from_id(ticket_id);
    if ticket_option.is_none() {
        return HttpResponse::NotFound().json(Message {
            message: "Failed to get support ticket".to_string()
        });
    }

    let mut ticket = ticket_option.unwrap();
    ticket.status = match ticket.status {
        1 => 2,
        _ => 1
    };
    ticket.updated = iso8601(&SystemTime::now());

    let updated_ticket = serde_json::from_str::<NewSupportTicket>(serde_json::to_string(&ticket).unwrap().as_str()).unwrap();
    match update_support_ticket_from_id(ticket_id, updated_ticket) {
        Some(ticket) => HttpResponse::Ok().json(ticket),
        None => HttpResponse::BadRequest().json(Message {
            message: "Failed to set ticket status".to_string()
        })
    }
}
