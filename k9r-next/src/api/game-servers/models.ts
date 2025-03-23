export type GameServer = {
    id: number;
    name: string;
    description: string;
    game: "minecraft";
    server_key: string;
    host_address: string;
    latest_state: string;
};