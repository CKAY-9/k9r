use actix_web::{web, HttpMessage, HttpRequest, HttpResponse};
use k9r_db::{crud::game_servers::delete_game_server_from_id, models::User};

use crate::models::Message;

pub async fn delete_game_server(
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

    match delete_game_server_from_id(path.into_inner().0) {
        true => {
            HttpResponse::Ok().json(Message {
                message: "Deleted game server".to_string()
            })
        }
        false => {
            HttpResponse::BadRequest().json(Message {
                message: "Failed to delete game server".to_string()
            })
        }
    }
}