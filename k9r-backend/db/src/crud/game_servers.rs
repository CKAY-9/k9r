use diesel::{query_dsl::methods::FindDsl, ExpressionMethods, RunQueryDsl};

use crate::{create_connection, models::{GameServer, NewGameServer}, schema::game_servers};

pub fn create_game_server(game_server: NewGameServer) -> Option<GameServer> {
    let connection = &mut create_connection();
    let insert = diesel::insert_into(game_servers::table)
        .values(game_server)
        .get_result::<GameServer>(connection);

    match insert {
        Ok(result) => {
            Some(result)
        }
        Err(_e) => {
            None
        }
    }
}

pub fn get_game_server_from_id(id: i32) -> Option<GameServer> {
    let connection = &mut create_connection();
    let find = game_servers::table
        .find(id)
        .first(connection);

    match find {
        Ok(result) => {
            Some(result)
        }
        Err(_e) => {
            None
        }
    }
}

pub fn get_all_game_servers() -> Vec<GameServer> {
    let connection = &mut create_connection();
    let sections = game_servers::table.load(connection);
    match sections {
        Ok(s) => {
            s
        },
        Err(_e) => {
            vec![]
        }
    }
}

pub fn update_game_server_from_id(id: i32, game_server: NewGameServer) -> Option<GameServer> {
    let connection = &mut create_connection();
    let update = diesel::update(game_servers::table)
        .filter(game_servers::id.eq(id))
        .set(game_server)
        .get_result::<GameServer>(connection);

    match update {
        Ok(result) => {
            Some(result)
        }
        Err(_e) => {
            None
        }
    }
}

pub fn delete_game_server_from_id(id: i32) -> bool {
    let connection = &mut create_connection();
    let delete = diesel::delete(game_servers::table)
        .filter(game_servers::id.eq(id))
        .execute(connection);

    match delete {
        Ok(_result) => {
            true
        }
        Err(_e) => {
            false
        }
    }
}