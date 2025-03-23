use actix_web::{web, HttpMessage, HttpRequest, HttpResponse};
use k9r_db::{
    crud::game_servers::create_game_server,
    models::{NewGameServer, User},
};

use crate::models::Message;

pub async fn new_game_server(
    (request, body): (HttpRequest, web::Json<NewGameServer>),
) -> HttpResponse {
    let _user = match request.extensions().get::<User>().cloned() {
        Some(user) => user,
        None => {
            return HttpResponse::Unauthorized().json(Message {
                message: "Failed to get user".to_string(),
            })
        }
    };

    match create_game_server(body.into_inner()) {
        Some(game_server) => HttpResponse::Ok().json(game_server),
        None => HttpResponse::BadRequest().json(Message {
            message: "Failed to create game server".to_string(),
        }),
    }
}
