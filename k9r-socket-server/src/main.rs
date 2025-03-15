use std::{net::{TcpListener, TcpStream}, thread::spawn};
use room::Room;
use tungstenite::{accept, Message, WebSocket};

pub mod room;
pub mod user;

fn handle_message(websocket: &WebSocket<TcpStream>, msg: Message) {
    let into_text = msg.into_text();
    if into_text.is_err() {
        return;
    }

    let text = into_text.unwrap();
}

fn main() {
    let server = TcpListener::bind("0.0.0.0:8081").unwrap();
    let rooms: Vec<Room> = vec![];

    for stream in server.incoming() {
        spawn (move || {
            let mut websocket: WebSocket<TcpStream> = accept(stream.unwrap()).unwrap();
            loop {
                let msg = websocket.read().unwrap();
                if msg.is_binary() || msg.is_text() {
                    handle_message(&websocket, msg);
                }
            }
        });
    }
}