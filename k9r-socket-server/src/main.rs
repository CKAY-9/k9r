use std::{net::{TcpListener, TcpStream}, thread::spawn};
use tungstenite::{accept, Message, WebSocket};

fn handle_message(websocket: &WebSocket<TcpStream>, msg: Message) {
    let into_text = msg.into_text();
    if into_text.is_err() {
        return;
    }

    let text = into_text.unwrap().to_string();

}

fn main() {
    let server = TcpListener::bind("0.0.0.0:8081").unwrap();

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