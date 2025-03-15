use std::net::TcpStream;

use tungstenite::WebSocket;

pub struct User {
    pub id: i32,
    pub username: String,
    pub display_name: String,
    pub websocket: WebSocket<TcpStream>
}