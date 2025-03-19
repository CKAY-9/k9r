use actix_web::{web, HttpMessage, HttpRequest, HttpResponse};
use k9r_db::{crud::community_details::update_community_details_from_id, models::{CommunityDetails, NewCommunityDetails, User}};

use crate::models::Message;

pub async fn update_community_details(
    (request, body): (HttpRequest, web::Json<CommunityDetails>),
) -> HttpResponse {
    let _user = match request.extensions().get::<User>().cloned() {
        Some(user) => user,
        None => {
            return HttpResponse::Unauthorized().json(Message {
                message: "Failed to get user".to_string(),
            });
        }
    };

    let update: NewCommunityDetails = serde_json::from_str(serde_json::to_string(&body).unwrap().as_str()).unwrap();
    match update_community_details_from_id(1, update) {
        Some(details) => {
            HttpResponse::Ok().json(details)
        }
        None => {
            HttpResponse::BadRequest().json(Message {
                message: "Failed to update community details".to_string()
            })
        }
    }
}
