use actix_web::{web, HttpMessage, HttpRequest, HttpResponse};
use k9r_db::{
    crud::game_servers::update_game_server_from_id,
    models::{GameServer, NewGameServer, User},
};

use crate::models::Message;

pub async fn update_game_server(
    (request, path, body): (HttpRequest, web::Path<(i32,)>, web::Json<GameServer>),
) -> HttpResponse {
    let _user = match request.extensions().get::<User>().cloned() {
        Some(user) => user,
        None => {
            return HttpResponse::Unauthorized().json(Message {
                message: "Failed to get user".to_string(),
            })
        }
    };

    let server = body.into_inner();
    let id = path.into_inner().0;

    let update =
        serde_json::from_str::<NewGameServer>(serde_json::to_string(&server).unwrap().as_str())
            .unwrap();
    match update_game_server_from_id(id, update) {
        Some(game_server) => HttpResponse::Ok().json(game_server),
        None => HttpResponse::BadRequest().json(Message {
            message: "Failed to update game server".to_string(),
        }),
    }
}
