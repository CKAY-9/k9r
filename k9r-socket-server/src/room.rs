use std::net::TcpStream;

use tungstenite::WebSocket;

use crate::user::User;

pub struct Room {
    pub connections: Vec<WebSocket<TcpStream>>,
    pub room_id: i32,
    pub users: Vec<User>
}