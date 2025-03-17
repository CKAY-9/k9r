use actix_web::{put, web, HttpMessage, HttpRequest, HttpResponse, Responder};
use k9r_db::{crud::community_details::update_community_details_from_id, models::{CommunityDetails, NewCommunityDetails, User}};

use crate::models::Message;

#[put("/details")]
pub async fn update_community_details(
    request: HttpRequest,
    body: web::Json<CommunityDetails>,
) -> Result<impl Responder, Box<dyn std::error::Error>> {
    let _user = match request.extensions().get::<User>().cloned() {
        Some(user) => user,
        None => {
            return Ok(HttpResponse::Unauthorized().json(Message {
                message: "Failed to get user".to_string(),
            }))
        }
    };

    let update: NewCommunityDetails = serde_json::from_str(serde_json::to_string(&body).unwrap().as_str()).unwrap();
    match update_community_details_from_id(1, update) {
        Some(details) => {
            Ok(HttpResponse::Ok().json(details))
        }
        None => {
            Ok(HttpResponse::BadRequest().json(Message {
                message: "Failed to update community details".to_string()
            }))
        }
    }
}
