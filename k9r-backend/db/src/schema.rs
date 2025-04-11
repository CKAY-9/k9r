// @generated automatically by Diesel CLI.

diesel::table! {
    admin_keys (id) {
        id -> Int4,
        permissions -> Int4,
        key -> Text,
        expires -> Text,
    }
}

diesel::table! {
    community_details (id) {
        id -> Int4,
        name -> Text,
        description -> Text,
        icon -> Text,
        banner -> Text,
        features -> Array<Bool>,
    }
}

diesel::table! {
    forum_posts (id) {
        id -> Int4,
        author -> Int4,
        content -> Text,
        json_content -> Text,
        created -> Text,
        updated -> Text,
        likes -> Array<Int4>,
        dislikes -> Array<Int4>,
        thread -> Int4,
        template -> Bool,
    }
}

diesel::table! {
    forum_sections (id) {
        id -> Int4,
        name -> Text,
        description -> Text,
        icon -> Text,
        color -> Text,
        topics -> Array<Int4>,
        sort_order -> Int4,
    }
}

diesel::table! {
    forum_threads (id) {
        id -> Int4,
        title -> Text,
        author -> Int4,
        created -> Text,
        updated -> Text,
        likes -> Array<Int4>,
        dislikes -> Array<Int4>,
        primary_post -> Int4,
        posts -> Array<Int4>,
        topic -> Int4,
        locked -> Bool,
        sticky -> Bool,
        template -> Bool,
    }
}

diesel::table! {
    forum_topics (id) {
        id -> Int4,
        name -> Text,
        description -> Text,
        icon -> Text,
        color -> Text,
        section -> Int4,
        threads -> Array<Int4>,
    }
}

diesel::table! {
    game_servers (id) {
        id -> Int4,
        name -> Text,
        description -> Text,
        game -> Text,
        server_key -> Text,
        host_address -> Text,
        latest_state -> Text,
    }
}

diesel::table! {
    support_ticket_replies (id) {
        id -> Int4,
        created -> Text,
        support_ticket -> Int4,
        user_id -> Int4,
        message -> Text,
        file_attachments -> Array<Text>,
    }
}

diesel::table! {
    support_tickets (id) {
        id -> Int4,
        status -> Int4,
        created -> Text,
        updated -> Text,
        creator -> Int4,
        issue_title -> Text,
        issue_topic -> Text,
        issue_description -> Text,
        involved_users -> Array<Int4>,
        file_attachments -> Array<Text>,
    }
}

diesel::table! {
    usergroups (id) {
        id -> Int4,
        name -> Text,
        color -> Text,
        icon -> Text,
        permissions -> Int4,
    }
}

diesel::table! {
    users (id) {
        id -> Int4,
        token -> Text,
        username -> Text,
        display_name -> Text,
        description -> Text,
        banned -> Bool,
        joined -> Text,
        oauth_type -> Text,
        followers -> Array<Int4>,
        following -> Array<Int4>,
        usergroups -> Array<Int4>,
        reputation -> Int4,
        avatar -> Text,
        banner -> Text,
    }
}

diesel::allow_tables_to_appear_in_same_query!(
    admin_keys,
    community_details,
    forum_posts,
    forum_sections,
    forum_threads,
    forum_topics,
    game_servers,
    support_ticket_replies,
    support_tickets,
    usergroups,
    users,
);
