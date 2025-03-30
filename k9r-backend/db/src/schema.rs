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
        likes -> Array<Nullable<Int4>>,
        dislikes -> Array<Nullable<Int4>>,
        thread -> Int4,
    }
}

diesel::table! {
    forum_sections (id) {
        id -> Int4,
        name -> Text,
        description -> Text,
        icon -> Text,
        color -> Text,
        topics -> Array<Nullable<Int4>>,
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
        likes -> Array<Nullable<Int4>>,
        dislikes -> Array<Nullable<Int4>>,
        primary_post -> Int4,
        posts -> Array<Nullable<Int4>>,
        topic -> Int4,
        locked -> Bool,
        sticky -> Bool,
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
        threads -> Array<Nullable<Int4>>,
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
        joined -> Text,
        oauth_type -> Text,
        followers -> Array<Nullable<Int4>>,
        following -> Array<Nullable<Int4>>,
        usergroups -> Array<Nullable<Int4>>,
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
    usergroups,
    users,
);
