CREATE TABLE forum_topics (
    id SERIAL NOT NULL PRIMARY KEY,
    name TEXT NOT NULL,
    description TEXT NOT NULL,
    icon TEXT NOT NULL,
    color TEXT NOT NULL,
    section INTEGER NOT NULL,
    threads INTEGER[] NOT NULL
);