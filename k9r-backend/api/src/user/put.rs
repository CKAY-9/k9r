use actix_web::{web, HttpMessage, HttpRequest, HttpResponse};
use k9r_db::{crud::users::update_user_from_id, models::{NewUser, User}};

use crate::{middleware::permissions::usergroups_match_permission, models::Message, permissions::EDIT_PROFILE_BANNER};

pub async fn update_user((request, body): (HttpRequest, web::Json<User>)) -> HttpResponse {
    let mut user = match request.extensions().get::<User>().cloned() {
        Some(user) => user,
        None => {
            return HttpResponse::Unauthorized().json(Message {
                message: "Failed to get user".to_string(),
            })
        }
    };

    user.display_name = body.display_name.clone();
    user.description = body.description.clone();
    user.avatar = body.avatar.clone();
    if usergroups_match_permission(user.usergroups.clone(), EDIT_PROFILE_BANNER) {
        user.banner = body.banner.clone();
    } else {
        user.banner = "".to_string();
    }

    let update =
        serde_json::from_str::<NewUser>(serde_json::to_string(&user).unwrap().as_str()).unwrap();
    match update_user_from_id(user.id, update) {
        Some(user) => {
            HttpResponse::Ok().json(user)
        }
        None => {
            HttpResponse::BadRequest().json(Message {
                message: "Failed to update user".to_string()
            })
        }
    }
}
