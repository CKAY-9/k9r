use actix_web::{web, HttpMessage, HttpRequest, HttpResponse};
use k9r_db::{crud::{support_ticket_replies::get_support_ticket_replies_from_support_ticket_id, support_tickets::{get_all_support_tickets, get_all_user_support_tickets, get_support_ticket_from_id}}, models::User};

use crate::models::Message;

use super::has_support_ticket_access;

pub async fn get_support_ticket((request, path): (HttpRequest, web::Path<(i32,)>)) -> HttpResponse {
    let user = match request.extensions().get::<User>().cloned() {
        Some(user) => user,
        None => {
            return HttpResponse::Unauthorized().json(Message {
                message: "Failed to get user".to_string(),
            })
        }
    };

    let support_ticket_option = get_support_ticket_from_id(path.into_inner().0);
    if support_ticket_option.is_none() {
        return HttpResponse::NotFound().json(Message {
            message: "Failed to get support ticket".to_string(),
        });
    }

    let support_ticket = support_ticket_option.unwrap();

    match has_support_ticket_access(&user, &support_ticket) {
        true => HttpResponse::Ok().json(support_ticket),
        false => HttpResponse::Unauthorized().json(Message {
            message: "Can't access support ticket".to_string(),
        }),
    }
}

pub async fn get_ticket_replies((request, path): (HttpRequest, web::Path<(i32,)>)) -> HttpResponse {
    let user = match request.extensions().get::<User>().cloned() {
        Some(user) => user,
        None => {
            return HttpResponse::Unauthorized().json(Message {
                message: "Failed to get user".to_string(),
            })
        }
    };

    let support_ticket_option = get_support_ticket_from_id(path.into_inner().0);
    if support_ticket_option.is_none() {
        return HttpResponse::NotFound().json(Message {
            message: "Failed to get support ticket".to_string(),
        });
    }

    let support_ticket = support_ticket_option.unwrap();

    if !has_support_ticket_access(&user, &support_ticket) {
        return HttpResponse::Unauthorized().json(Message {
            message: "Can't access support ticket".to_string(),
        });
    }

    let replies = get_support_ticket_replies_from_support_ticket_id(support_ticket.id);
    HttpResponse::Ok().json(replies)
}

pub async fn all_support_tickets(
    request: HttpRequest
) -> HttpResponse {
    let _user = match request.extensions().get::<User>().cloned() {
        Some(user) => user,
        None => {
            return HttpResponse::Unauthorized().json(Message {
                message: "Failed to get user".to_string(),
            })
        }
    };

    let all_tickets = get_all_support_tickets();
    HttpResponse::Ok().json(all_tickets)
}

pub async fn all_user_associated_support_tickets(
    request: HttpRequest
) -> HttpResponse {
    let user = match request.extensions().get::<User>().cloned() {
        Some(user) => user,
        None => {
            return HttpResponse::Unauthorized().json(Message {
                message: "Failed to get user".to_string(),
            })
        }
    };

    let all_tickets = get_all_user_support_tickets(user.id);
    HttpResponse::Ok().json(all_tickets)
}