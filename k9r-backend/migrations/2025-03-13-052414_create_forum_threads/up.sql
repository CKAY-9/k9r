CREATE TABLE forum_threads (
    id SERIAL NOT NULL PRIMARY KEY,
    title TEXT NOT NULL,
    author INTEGER NOT NULL,
    created TEXT NOT NULL,
    updated TEXT NOT NULL,
    LIKES INTEGER[] NOT NULL,
    DISLIKES INTEGER[] NOT NULL,
    primary_post INTEGER NOT NULL,
    posts INTEGER[] NOT NULL,
    topic INTEGER NOT NULL,
    locked BOOLEAN NOT NULL,
    sticky BOOLEAN NOT NULL
);