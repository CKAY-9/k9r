use actix_web::{get, web, HttpRequest, HttpResponse, Responder};
use k9r_db::crud::{
    forum_posts::{get_forum_post_from_id, get_forum_posts_in_forum_thread}, forum_sections::{get_all_forum_sections, get_forum_section_from_id}, forum_threads::{get_all_forum_threads, get_forum_thread_from_id, get_threads_in_forum_topic}, forum_topics::{get_all_forum_topics, get_forum_topic_from_id, get_forum_topics_from_section}
};

use crate::{forum::models::ThreadCount, models::Message};

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

#[get("/topic/{id}/threads")]
pub async fn get_topic_threads(
    path: web::Path<(i32,)>
) -> Result<impl Responder, Box<dyn std::error::Error>> {
    let topic_id = path.into_inner().0;
    let threads = get_threads_in_forum_topic(topic_id);
    Ok(HttpResponse::Ok().json(threads))
}

#[get("/thread/count")]
pub async fn get_total_thread_count() -> Result<impl Responder, Box<dyn std::error::Error>> {
    let threads = get_all_forum_threads();
    Ok(HttpResponse::Ok().json(ThreadCount {
        threads: threads.len()
    }))
}

#[get("/thread/{id}")]
pub async fn get_thread(
    path: web::Path<(i32, )>
) -> Result<impl Responder, Box<dyn std::error::Error>> {
    match get_forum_thread_from_id(path.into_inner().0) {
        Some(thread) => {
            Ok(HttpResponse::Ok().json(thread))
        }
        None => {
            Ok(HttpResponse::NotFound().json(Message {
                message: "Failed to get thread".to_string()
            }))
        }
    }
}

#[get("/thread/{id}/posts")]
pub async fn get_posts_in_thread(
    path: web::Path<(i32, )>
) -> Result<impl Responder, Box<dyn std::error::Error>> {
    let posts = get_forum_posts_in_forum_thread(path.into_inner().0);
    Ok(HttpResponse::Ok().json(posts))
}

#[get("/post/{id}")]
pub async fn get_post(
    path: web::Path<(i32, )>
) -> Result<impl Responder, Box<dyn std::error::Error>> {
    match get_forum_post_from_id(path.into_inner().0) {
        Some(post) => {
            Ok(HttpResponse::Ok().json(post))
        }
        None => {
            Ok(HttpResponse::NotFound().json(Message {
                message: "Failed to get post".to_string()
            }))
        }
    }
}