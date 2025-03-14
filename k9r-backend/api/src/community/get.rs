use actix_web::{get, http::StatusCode, HttpResponse, Responder};
use k9r_db::{crud::community_details::{create_community_details, get_community_details_from_id}, models::NewCommunityDetails};

#[get("/details")]
pub async fn get_community_details() -> Result<impl Responder, Box<dyn std::error::Error>> {
    let find = get_community_details_from_id(1);
    match find {
        Some(result) => {
            Ok(HttpResponse::Ok().json(result))
        }
        None => {
            let initial_details: NewCommunityDetails = NewCommunityDetails {
                name: "K9-Revive".to_string(),
                description: "An absolute overhaul to K9-Forums. The perfect website.".to_string(),
                icon: "/icon.png".to_string(),
                banner: "/wikimedia_commons_backgorund.gif".to_string()
            };

            let insert = create_community_details(initial_details);
            match insert {
                Some(result) => {
                    Ok(HttpResponse::Ok().json(result))
                }
                None => {
                    Ok(HttpResponse::Ok().status(StatusCode::NOT_FOUND).body("Failed to get community details."))
                }
            } 
        }
    }
}