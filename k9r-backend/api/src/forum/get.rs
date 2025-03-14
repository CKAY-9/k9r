use actix_web::{get, web, HttpRequest, HttpResponse, Responder};
use k9r_db::crud::{
    forum_sections::{get_all_forum_sections, get_forum_section_from_id},
    forum_topics::{get_all_forum_topics, get_forum_topic_from_id, get_forum_topics_from_section},
};

use crate::models::Message;

#[get("/section")]
pub async fn all_forum_sections(
    _request: HttpRequest,
) -> Result<impl Responder, Box<dyn std::error::Error>> {
    let sections = get_all_forum_sections();
    Ok(HttpResponse::Ok().json(sections))
}

#[get("/topic")]
pub async fn all_topics(
    _request: HttpRequest,
) -> Result<impl Responder, Box<dyn std::error::Error>> {
    let topics = get_all_forum_topics();
    Ok(HttpResponse::Ok().json(topics))
}

#[get("/section/{id}")]
pub async fn get_section(
    path: web::Path<(i32,)>,
) -> Result<impl Responder, Box<dyn std::error::Error>> {
    let section_id = path.into_inner().0;
    match get_forum_section_from_id(section_id) {
        Some(s) => Ok(HttpResponse::Ok().json(s)),
        None => Ok(HttpResponse::NotFound().json(Message {
            message: "Failed to get section".to_string(),
        })),
    }
}

#[get("/section/{id}/topics")]
pub async fn all_section_topics(
    path: web::Path<(i32,)>,
) -> Result<impl Responder, Box<dyn std::error::Error>> {
    let section_id = path.into_inner().0;
    let topics = get_forum_topics_from_section(section_id);

    Ok(HttpResponse::Ok().json(topics))
}

#[get("/topic/{id}")]
pub async fn get_topic(
    path: web::Path<(i32,)>,
) -> Result<impl Responder, Box<dyn std::error::Error>> {
    let topic_id = path.into_inner().0;
    match get_forum_topic_from_id(topic_id) {
        Some(t) => Ok(HttpResponse::Ok().json(t)),
        None => Ok(HttpResponse::NotFound().json(Message {
            message: "Failed to get topic".to_string(),
        })),
    }
}
