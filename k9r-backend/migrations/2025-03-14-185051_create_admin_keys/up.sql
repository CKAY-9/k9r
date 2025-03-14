CREATE TABLE admin_keys (
    id SERIAL NOT NULL PRIMARY KEY,
    permissions INTEGER NOT NULL,
    key TEXT NOT NULL,
    expires TEXT NOT NULL
);