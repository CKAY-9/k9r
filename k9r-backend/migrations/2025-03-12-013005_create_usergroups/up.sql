CREATE TABLE usergroups (
    id SERIAL NOT NULL PRIMARY KEY,
    name TEXT NOT NULL,
    color TEXT NOT NULL,
    icon TEXT NOT NULL,
    permissions INTEGER NOT NULL
);