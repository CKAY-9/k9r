use std::time::SystemTime;

use actix_web::{http::StatusCode, post, web, HttpMessage, HttpRequest, HttpResponse};
use k9r_db::{
    crud::{
        forum_posts::{create_forum_post, get_forum_post_from_id, update_forum_post_from_id},
        forum_sections::{
            create_forum_section, get_forum_section_from_id, update_forum_section_from_id,
        },
        forum_threads::{
            create_forum_thread, delete_forum_thread_from_id, get_forum_thread_from_id,
            update_forum_thread_from_id,
        },
        forum_topics::{create_forum_topic, delete_forum_topic_from_id},
    },
    models::{
        ForumPost, ForumSection, NewForumPost, NewForumSection, NewForumThread, NewForumTopic, User,
    },
};
use k9r_utils::iso8601;

use crate::{forum::models::NewThread, models::Message};

use super::models::Like;

#[post("/section")]
pub async fn new_forum_section(
    _request: HttpRequest,
    body: web::Json<NewForumSection>,
) -> HttpResponse {
    let mut new_section = body.into_inner();
    new_section.topics = Vec::new();

    let insert = create_forum_section(new_section);
    match insert {
        Some(fs) => HttpResponse::Ok().json(fs),
        None => HttpResponse::BadRequest().json(Message {
            message: "Failed to create forum section".to_string(),
        }),
    }
}

#[post("/topic")]
pub async fn new_forum_topic(
    _request: HttpRequest,
    body: web::Json<NewForumTopic>,
) -> HttpResponse {
    let new_topic = body.into_inner();
    let parent_section_opt = get_forum_section_from_id(new_topic.section);
    if parent_section_opt.is_none() {
        return HttpResponse::NotFound().json(Message {
            message: "Failed to get parent section".to_string(),
        });
    }

    let mut parent_section = parent_section_opt.unwrap();
    let insert_topic_opt = create_forum_topic(new_topic);
    if insert_topic_opt.is_none() {
        return HttpResponse::BadRequest().json(Message {
            message: "Failed to create forum topic".to_string(),
        });
    }

    let topic = insert_topic_opt.unwrap();
    parent_section.topics.push(topic.id);

    let update_section: NewForumSection = serde_json::from_str(
        serde_json::to_string::<ForumSection>(&parent_section)
            .unwrap()
            .as_str(),
    )
    .unwrap();

    let update = update_forum_section_from_id(parent_section.id, update_section);
    match update {
        Some(_section) => HttpResponse::Ok().json(topic),
        None => {
            delete_forum_topic_from_id(topic.id);
            HttpResponse::BadRequest().json(Message {
                message: "Failed to update forum section".to_string(),
            })
        }
    }
}

pub async fn new_forum_thread(
    (request, body): (HttpRequest, web::Json<NewThread>),
) -> HttpResponse {
    let user = match request.extensions().get::<User>().cloned() {
        Some(user) => user,
        None => {
            return HttpResponse::Unauthorized().json(Message {
                message: "Failed to get user".to_string(),
            });
        }
    };

    let data = body.into_inner();
    let mut new_thread = data.new_thread;
    let mut new_post = data.new_post;

    // Override incoming data
    let current_timestamp = iso8601(&SystemTime::now());
    new_thread.created = current_timestamp.clone();
    new_thread.updated = current_timestamp.clone();
    new_post.created = current_timestamp.clone();
    new_post.updated = current_timestamp;

    new_thread.likes = Vec::new();
    new_thread.dislikes = Vec::new();
    new_post.likes = Vec::new();
    new_post.dislikes = Vec::new();

    new_post.author = user.id;
    new_thread.author = user.id;

    new_thread.locked = false;
    new_thread.sticky = false;

    // Inserts and updates
    let thread_insert = create_forum_thread(new_thread);
    if thread_insert.is_none() {
        return HttpResponse::Ok()
            .status(StatusCode::BAD_REQUEST)
            .json(Message {
                message: "Failed to insert forum thread".to_string(),
            });
    }

    let mut thread = thread_insert.unwrap();

    let post_insert = create_forum_post(new_post);
    if post_insert.is_none() {
        delete_forum_thread_from_id(thread.id);
        return HttpResponse::Ok()
            .status(StatusCode::BAD_REQUEST)
            .json(Message {
                message: "Failed to insert forum post".to_string(),
            });
    }

    let mut post: ForumPost = post_insert.unwrap();

    thread.posts.push(post.id);
    thread.primary_post = post.id;

    post.thread = thread.id;

    let updated_thread: NewForumThread =
        serde_json::from_str(serde_json::to_string(&thread).unwrap().as_str()).unwrap();
    let thread_update = update_forum_thread_from_id(thread.id, updated_thread);

    if thread_update.is_none() {
        // TODO: Handle post
        return HttpResponse::Ok()
            .status(StatusCode::BAD_REQUEST)
            .json(Message {
                message: "Failed to update forum thread".to_string(),
            });
    }

    let updated_post: NewForumPost =
        serde_json::from_str(serde_json::to_string(&post).unwrap().as_str()).unwrap();
    let post_update = update_forum_post_from_id(post.id, updated_post);

    if post_update.is_none() {
        // TODO: Handle thread
        return HttpResponse::Ok()
            .status(StatusCode::BAD_REQUEST)
            .json(Message {
                message: "Failed to update forum post".to_string(),
            });
    }

    HttpResponse::Ok().json(thread_update.unwrap())
}

pub async fn new_forum_post(
    (request, body): (HttpRequest, web::Json<NewForumPost>),
) -> HttpResponse {
    let user = match request.extensions().get::<User>().cloned() {
        Some(user) => user,
        None => {
            return HttpResponse::Unauthorized().json(Message {
                message: "Failed to get user".to_string(),
            })
        }
    };

    let mut new_post = body.into_inner();

    let thread_opt = get_forum_thread_from_id(new_post.thread);
    if thread_opt.is_none() {
        return HttpResponse::NotFound().json(Message {
            message: "Failed to get forum thread".to_string(),
        });
    }

    let mut thread = thread_opt.unwrap();
    if thread.locked {
        return HttpResponse::BadRequest().json(Message {
            message: "Can't post to a locked thread".to_string(),
        });
    }

    let current_timestamp = iso8601(&SystemTime::now());
    new_post.likes = Vec::new();
    new_post.dislikes = Vec::new();
    new_post.updated = current_timestamp.clone();
    new_post.created = current_timestamp;
    new_post.author = user.id;

    match create_forum_post(new_post) {
        Some(post) => {
            thread.posts.push(post.id);
            let updated_thread: NewForumThread =
                serde_json::from_str(serde_json::to_string(&thread).unwrap().as_str()).unwrap();
            match update_forum_thread_from_id(thread.id, updated_thread) {
                Some(_t) => HttpResponse::Ok().json(post),
                None => {
                    // TODO: Cleanup post
                    HttpResponse::BadRequest().json(Message {
                        message: "Failed to update forum thread".to_string(),
                    })
                }
            }
        }
        None => HttpResponse::BadRequest().json(Message {
            message: "Failed to create forum post".to_string(),
        }),
    }
}

pub async fn like_post(
    (request, path, body): (HttpRequest, web::Path<(i32,)>, web::Json<Like>),
) -> HttpResponse {
    let user = match request.extensions().get::<User>().cloned() {
        Some(user) => user,
        None => {
            return HttpResponse::Unauthorized().json(Message {
                message: "Failed to get user".to_string(),
            });
        }
    };

    let post_option = get_forum_post_from_id(path.into_inner().0);
    if post_option.is_none() {
        return HttpResponse::NotFound().json(Message {
            message: "Failed to get forum post".to_string(),
        });
    }

    let mut post = post_option.unwrap();

    // Clear likes/dislikes if already exists
    post.likes.retain(|x| x != &user.id);
    post.dislikes.retain(|x| x != &user.id);

    match body.state {
        1 => {
            post.likes.push(user.id);
        }
        -1 => {
            post.dislikes.push(user.id);
        }
        _ => {
            // do nothing
        }
    }

    let updated =
        serde_json::from_str::<NewForumPost>(serde_json::to_string(&post).unwrap().as_str())
            .unwrap();
    match update_forum_post_from_id(post.id, updated) {
        Some(post) => HttpResponse::Ok().json(post),
        None => HttpResponse::BadRequest().json(Message {
            message: "Failed to update likes/dislikes on post".to_string(),
        }),
    }
}

pub async fn like_thread(
    (request, path, body): (HttpRequest, web::Path<(i32,)>, web::Json<Like>),
) -> HttpResponse {
    let user = match request.extensions().get::<User>().cloned() {
        Some(user) => user,
        None => {
            return HttpResponse::Unauthorized().json(Message {
                message: "Failed to get user".to_string(),
            });
        }
    };

    let thread_option = get_forum_thread_from_id(path.into_inner().0);
    if thread_option.is_none() {
        return HttpResponse::NotFound().json(Message {
            message: "Failed to get forum thread".to_string(),
        });
    }

    let mut thread = thread_option.unwrap();

    // Clear likes/dislikes if already exists
    thread.likes.retain(|x| x != &user.id);
    thread.dislikes.retain(|x| x != &user.id);

    match body.state {
        1 => {
            thread.likes.push(user.id);
        }
        -1 => {
            thread.dislikes.push(user.id);
        }
        _ => {
            // do nothing
        }
    }

    let updated =
        serde_json::from_str::<NewForumThread>(serde_json::to_string(&thread).unwrap().as_str())
            .unwrap();
    match update_forum_thread_from_id(thread.id, updated) {
        Some(thread) => HttpResponse::Ok().json(thread),
        None => HttpResponse::BadRequest().json(Message {
            message: "Failed to update likes/dislikes on thread".to_string(),
        }),
    }
}
