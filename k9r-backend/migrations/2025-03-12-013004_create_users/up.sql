CREATE TABLE users (
    id SERIAL NOT NULL PRIMARY KEY,
    token TEXT NOT NULL,
    username TEXT NOT NULL,
    display_name TEXT NOT NULL,
    description TEXT NOT NULL,
    joined TEXT NOT NULL,
    oauth_type TEXT NOT NULL,
    followers INTEGER[] NOT NULL,
    following INTEGER[] NOT NULL,
    usergroups INTEGER[] NOT NULL,
    reputation INTEGER NOT NULL,
    avatar TEXT NOT NULL,
    banner TEXT NOT NULL
);