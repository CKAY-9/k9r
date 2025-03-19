use std::time::SystemTime;

use actix_web::{put, web, HttpMessage, HttpRequest, HttpResponse, Responder};
use k9r_db::{
    crud::{
        forum_posts::{get_forum_post_from_id, update_forum_post_from_id}, forum_sections::{create_forum_section, update_forum_section_from_id}, forum_threads::{get_forum_thread_from_id, update_forum_thread_from_id}, forum_topics::{create_forum_topic, update_forum_topic_from_id}
    },
    models::{ForumPost, ForumSection, ForumThread, ForumTopic, NewForumSection, NewForumTopic, User},
};
use k9r_utils::iso8601;

use crate::models::Message;

#[put("/section")]
pub async fn update_all_sections(
    _request: HttpRequest,
    data: web::Json<Vec<ForumSection>>,
) -> Result<impl Responder, Box<dyn std::error::Error>> {
    let updated_sections = data.into_inner();
    let mut finished_sections: Vec<ForumSection> = Vec::new();

    for section in updated_sections.iter() {
        let update = serde_json::from_str::<NewForumSection>(
            serde_json::to_string(&section).unwrap().as_str(),
        )
        .unwrap();

        if section.id <= 0 {
            // insert
            match create_forum_section(update) {
                Some(s) => {
                    finished_sections.push(s);
                }
                None => {}
            }
        } else {
            match update_forum_section_from_id(section.id, update) {
                Some(s) => {
                    finished_sections.push(s);
                }
                None => {}
            }
        }
    }

    Ok(HttpResponse::Ok().json(finished_sections))
}

#[put("/topic")]
pub async fn update_all_topics(
    _request: HttpRequest,
    data: web::Json<Vec<ForumTopic>>,
) -> Result<impl Responder, Box<dyn std::error::Error>> {
    let updated_topics = data.into_inner();
    let mut finished_topics: Vec<ForumTopic> = Vec::new();

    for forum_topic in updated_topics.iter() {
        let update = serde_json::from_str::<NewForumTopic>(
            serde_json::to_string(forum_topic).unwrap().as_str(),
        )
        .unwrap();

        if forum_topic.id <= 0 {
            // insert
            match create_forum_topic(update) {
                Some(t) => {
                    finished_topics.push(t);
                }
                None => {}
            }
        } else {
            match update_forum_topic_from_id(forum_topic.id, update) {
                Some(t) => {
                    finished_topics.push(t);
                }
                None => {}
            }
        }
    }

    Ok(HttpResponse::Ok().json(finished_topics))
}

pub async fn update_post(
    (request, mut body): (HttpRequest, web::Json<ForumPost>),
) -> Result<impl Responder, Box<dyn std::error::Error>> {
    let user = match request.extensions().get::<User>().cloned() {
        Some(user) => user,
        None => {
            return Ok(HttpResponse::Unauthorized().json(Message {
                message: "Failed to get user".to_string(),
            }))
        }
    };

    let post_id = body.id.clone();
    let existing_post_option = get_forum_post_from_id(post_id);
    if existing_post_option.is_none() {
        return Ok(HttpResponse::NotFound().json(Message {
            message: "Failed to get post".to_string()
        }));
    }

    let existing_post = existing_post_option.unwrap();
    if user.id != existing_post.author {
        return Ok(HttpResponse::Unauthorized().json(Message {
            message: "Invalid user".to_string(),
        }));
    }

    body.updated = iso8601(&SystemTime::now());
    let update =
        serde_json::from_str(serde_json::to_string(&body.into_inner()).unwrap().as_str()).unwrap();

    match update_forum_post_from_id(existing_post.id, update) {
        Some(post) => Ok(HttpResponse::Ok().json(post)),
        None => Ok(HttpResponse::BadRequest().json(Message {
            message: "Failed to update forum post".to_string(),
        })),
    }
}

pub async fn update_thread(
    (request, mut body): (HttpRequest, web::Json<ForumThread>)
) -> HttpResponse {
    let user = match request.extensions().get::<User>().cloned() {
        Some(user) => user,
        None => {
            return HttpResponse::Unauthorized().json(Message {
                message: "Failed to get user".to_string(),
            })
        }
    };

    let thread_id = body.id.clone();
    let existing_thread_option = get_forum_thread_from_id(thread_id);
    if existing_thread_option.is_none() {
        return HttpResponse::NotFound().json(Message {
            message: "Failed to get thread".to_string()
        });
    }

    let existing_thread = existing_thread_option.unwrap();
    if user.id != existing_thread.author {
        return HttpResponse::Unauthorized().json(Message {
            message: "Invalid user".to_string(),
        });
    }

    body.updated = iso8601(&SystemTime::now());
    let update =
        serde_json::from_str(serde_json::to_string(&body.into_inner()).unwrap().as_str()).unwrap();

    match update_forum_thread_from_id(existing_thread.id, update) {
        Some(thread) => HttpResponse::Ok().json(thread),
        None => HttpResponse::BadRequest().json(Message {
            message: "Failed to update forum thread".to_string(),
        }),
    }
}