CREATE TABLE game_servers(
    id SERIAL NOT NULL PRIMARY KEY,
    name TEXT NOT NULL,
    description TEXT NOT NULL,
    game TEXT NOT NULL,
    server_key TEXT NOT NULL,
    host_address TEXT NOT NULL,
    latest_state TEXT NOT NULL
);