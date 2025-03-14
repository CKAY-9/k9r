CREATE TABLE forum_posts (
    id SERIAL NOT NULL PRIMARY KEY,
    author INTEGER NOT NULL,
    content TEXT NOT NULL,
    json_content TEXT NOT NULL,
    created TEXT NOT NULL,
    updated TEXT NOT NULL,
    LIKES INTEGER[] NOT NULL,
    DISLIKES INTEGER[] NOT NULL,
    thread INTEGER NOT NULL
);