use actix_web::{web, HttpMessage, HttpRequest, HttpResponse};
use k9r_db::{
    crud::usergroups::{create_usergroup, get_usergroup_from_id, update_usergroup_from_id},
    models::{NewUsergroup, User, Usergroup},
};

use crate::models::Message;

pub async fn update_usergroup_by_id(
    (request, body): (HttpRequest, web::Json<Usergroup>),
) -> HttpResponse {
    let _user = match request.extensions().get::<User>().cloned() {
        Some(user) => user,
        None => {
            return HttpResponse::Unauthorized().json(Message {
                message: "Failed to get user".to_string(),
            })
        }
    };

    let converted: NewUsergroup = serde_json::from_str(serde_json::to_string(&body).unwrap().as_str()).unwrap();
    match get_usergroup_from_id(body.id) {
        Some(_usergroup) => {
            match update_usergroup_from_id(body.id, converted) {
                Some(update) => {
                    HttpResponse::Ok().json(update)
                }
                None => {
                    HttpResponse::BadRequest().json(Message {
                        message: "Failed to update usergroup".to_string()
                    })
                }
            }
        }
        None => {
            match create_usergroup(converted) {
                Some(insert) => {
                    HttpResponse::Ok().json(insert)
                }
                None => {
                    HttpResponse::BadRequest().json(Message {
                        message: "Failed to update usergroup".to_string()
                    })
                }
            }
        }
    }
}
