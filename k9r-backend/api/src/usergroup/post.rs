use actix_web::{web, HttpMessage, HttpRequest, HttpResponse};
use k9r_db::{crud::usergroups::create_usergroup, models::{NewUsergroup, User}};

use crate::models::Message;

pub async fn new_usergroup(
    (request, body): (HttpRequest, web::Json<NewUsergroup>)
) -> HttpResponse {
    let _user = match request.extensions().get::<User>().cloned() {
        Some(user) => user,
        None => {
            return HttpResponse::Unauthorized().json(Message {
                message: "Failed to get user".to_string(),
            })
        }
    };

    match create_usergroup(body.into_inner()) {
        Some(usergroup) => {
            HttpResponse::Ok().json(usergroup)
        }
        None => {
            HttpResponse::BadRequest().json(Message {
                message: "Failed to create usergroup".to_string()
            })
        }
    }
}