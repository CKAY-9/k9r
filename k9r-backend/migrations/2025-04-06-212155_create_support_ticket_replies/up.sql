-- Your SQL goes here
CREATE TABLE support_ticket_replies(
    id SERIAL NOT NULL PRIMARY KEY,
    created TEXT NOT NULL,
    support_ticket INTEGER NOT NULL,
    user_id INTEGER NOT NULL,
    message TEXT NOT NULL,
    file_attachments TEXT[] NOT NULL
);