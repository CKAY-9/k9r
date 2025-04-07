use std::time::SystemTime;

use actix_web::{web, HttpMessage, HttpRequest, HttpResponse};
use k9r_db::{
    crud::{
        support_ticket_replies::create_support_ticket_reply,
        support_tickets::{create_support_ticket, get_support_ticket_from_id, update_support_ticket_from_id},
    },
    models::{NewSupportTicket, NewSupportTicketReply, User},
};
use k9r_utils::iso8601;

use crate::models::Message;

use super::has_support_ticket_access;

pub async fn new_support_ticket(
    (request, mut body): (HttpRequest, web::Json<NewSupportTicket>),
) -> HttpResponse {
    let user = match request.extensions().get::<User>().cloned() {
        Some(user) => user,
        None => {
            return HttpResponse::Unauthorized().json(Message {
                message: "Failed to get user".to_string(),
            })
        }
    };

    if body.issue_title.len() < 10 {
        return HttpResponse::BadRequest().json(Message {
            message: "Issue title too short!".to_string(),
        });
    }

    if body.issue_description.len() < 50 {
        return HttpResponse::BadRequest().json(Message {
            message: "Issue description too short!".to_string(),
        });
    }

    let allowed_issue_topics = vec![
        "general",
        "forum",
        "store",
        "community",
        "game server",
        "users",
    ];
    let mut flag = false;
    for allowed in allowed_issue_topics {
        if allowed == body.issue_topic {
            flag = true;
            break;
        }
    }

    if body.issue_topic == "users" && body.involved_users.len() <= 0 {
        return HttpResponse::BadRequest().json(Message {
            message: "Must mention at least one user in this issue topic!".to_string(),
        });
    }

    if !flag {
        return HttpResponse::BadRequest().json(Message {
            message: "Invalid issue topic".to_string(),
        });
    }

    body.creator = user.id;
    body.status = 0;
    let iso_string: String = iso8601(&SystemTime::now());
    body.created = iso_string.clone();
    body.updated = iso_string;

    match create_support_ticket(body.into_inner()) {
        Some(ticket) => HttpResponse::Ok().json(ticket),
        None => HttpResponse::BadRequest().json(Message {
            message: "Failed to create support ticket".to_string(),
        }),
    }
}

pub async fn new_support_ticket_reply(
    (request, path, mut body): (
        HttpRequest,
        web::Path<(i32,)>,
        web::Json<NewSupportTicketReply>,
    ),
) -> HttpResponse {
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

    let mut support_ticket = support_ticket_option.unwrap();
    if !has_support_ticket_access(&user, &support_ticket) {
        return HttpResponse::Unauthorized().json(Message {
            message: "Can't access support ticket".to_string(),
        });
    }

    if body.message.len() < 10 {
        return HttpResponse::BadRequest().json(Message {
            message: "Reply message too short".to_string(),
        });
    }

    body.created = iso8601(&SystemTime::now());
    body.user_id = user.id;

    match create_support_ticket_reply(body.into_inner()) {
        Some(reply) => {
            support_ticket.updated = iso8601(&SystemTime::now());
            if support_ticket.status == 0 {
                support_ticket.status = 1;
            }

            let updated_ticket = serde_json::from_str::<NewSupportTicket>(
                serde_json::to_string(&support_ticket).unwrap().as_str(),
            )
            .unwrap();

            update_support_ticket_from_id(support_ticket.id, updated_ticket);

            HttpResponse::Ok().json(reply)
        }
        None => HttpResponse::BadRequest().json(Message {
            message: "Failed to create ticket reply".to_string(),
        }),
    }
}
