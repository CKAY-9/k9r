CREATE TABLE support_tickets(
    id SERIAL NOT NULL PRIMARY KEY,
    status INTEGER NOT NULL,
    created TEXT NOT NULL,
    updated TEXT NOT NULL,
    creator INTEGER NOT NULL,
    issue_title TEXT NOT NULL,
    issue_topic TEXT NOT NULL,
    issue_description TEXT NOT NULL,
    involved_users INTEGER[] NOT NULL,
    file_attachments TEXT[] NOT NULL
);