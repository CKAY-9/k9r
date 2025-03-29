export type GameServer = {
    id: number;
    name: string;
    description: string;
    game: "minecraft";
    server_key: string;
    host_address: string;
    latest_state: string;
};

export type ServerMessage = {
    sender: string;
    content: string;
    server_key: string;
    room: string;
}