use actix_web::{web, HttpMessage, HttpRequest, HttpResponse};
use k9r_db::{
    crud::game_servers::create_game_server,
    models::{NewGameServer, User},
};
use rand::Rng;
use sha2::{Digest, Sha256};

use crate::models::Message;

pub async fn new_game_server(
    (request, mut body): (HttpRequest, web::Json<NewGameServer>),
) -> HttpResponse {
    let _user = match request.extensions().get::<User>().cloned() {
        Some(user) => user,
        None => {
            return HttpResponse::Unauthorized().json(Message {
                message: "Failed to get user".to_string(),
            })
        }
    };

    let mut rng = rand::rng();
    let random_number: f64 = rng.random();
    let mut hasher = Sha256::new();
    hasher.update(
        format!(
            "{}{}",
            body.name,
            random_number * 100_000_000_000f64
        )
        .into_bytes(),
    );
    let server_key: String = format!("{:X}", hasher.finalize()).to_string();
    body.server_key = server_key;

    match create_game_server(body.into_inner()) {
        Some(game_server) => HttpResponse::Ok().json(game_server),
        None => HttpResponse::BadRequest().json(Message {
            message: "Failed to create game server".to_string(),
        }),
    }
}
