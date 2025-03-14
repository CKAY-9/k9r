CREATE TABLE forum_sections (
    id SERIAL NOT NULL PRIMARY KEY,
    name TEXT NOT NULL,
    description TEXT NOT NULL,
    icon TEXT NOT NULL,
    color TEXT NOT NULL,
    topics INTEGER[] NOT NULL,
    sort_order INTEGER NOT NULL
);