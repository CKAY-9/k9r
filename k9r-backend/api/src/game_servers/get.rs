use actix_web::{get, web, HttpMessage, HttpRequest, HttpResponse};
use k9r_db::{crud::game_servers::{get_all_game_servers, get_game_server_from_id}, models::GameServer};

use crate::models::Message;

#[get("/{id}")]
pub async fn get_game_server(
    (_request, path): (HttpRequest, web::Path<(i32,)>)
) -> HttpResponse {
    match get_game_server_from_id(path.into_inner().0) {
        Some(mut server) => {
            server.server_key = String::from("");
            HttpResponse::Ok().json(server)
        }   
        None => {
            HttpResponse::NotFound().json(Message {
                message: "Failed to get game server".to_string()
            })
        }
    }
}

#[get("/all")]
pub async fn all_game_servers(
    _request: HttpRequest
) -> HttpResponse {
    let servers = get_all_game_servers();
    HttpResponse::Ok().json(servers)
}

pub async fn get_authorized_server(
    request: HttpRequest
) -> HttpResponse {
    let game_server = match request.extensions_mut().get::<GameServer>().cloned() {
        Some(server) => server,
        None => {
            return HttpResponse::Unauthorized().json(Message {
                message: "Failed to get game server".to_string(),
            })
        }
    };

    HttpResponse::Ok().json(game_server)
}