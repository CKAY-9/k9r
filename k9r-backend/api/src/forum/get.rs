use actix_web::{get, web, HttpRequest, HttpResponse};
use k9r_db::crud::{
    forum_posts::{get_all_forum_posts, get_forum_post_from_id, get_forum_posts_in_forum_thread, get_latest_forum_posts},
    forum_sections::{get_all_forum_sections, get_forum_section_from_id},
    forum_threads::{
        get_all_forum_threads, get_forum_thread_from_id, get_threads_in_forum_topic,
        search_threads_with_page,
    },
    forum_topics::{get_all_forum_topics, get_forum_topic_from_id, get_forum_topics_from_section, get_latest_forum_thread_in_forum_topic_from_id},
};

use crate::{
    forum::models::{PostCount, ThreadCount},
    models::{Message, SearchModel},
};

#[get("/section")]
pub async fn all_forum_sections(
    _request: HttpRequest,
) -> HttpResponse {
    let sections = get_all_forum_sections();
    HttpResponse::Ok().json(sections)
}

#[get("/topic")]
pub async fn all_topics(
    _request: HttpRequest,
) -> HttpResponse {
    let topics = get_all_forum_topics();
    HttpResponse::Ok().json(topics)
}

#[get("/recent_posts")]
pub async fn get_recent_posts(
    _request: HttpRequest
) -> HttpResponse {
    let posts = get_latest_forum_posts();
    HttpResponse::Ok().json(posts)
}

#[get("/section/{id}")]
pub async fn get_section(
    path: web::Path<(i32,)>,
) -> HttpResponse {
    let section_id = path.into_inner().0;
    match get_forum_section_from_id(section_id) {
        Some(s) => HttpResponse::Ok().json(s),
        None => HttpResponse::NotFound().json(Message {
            message: "Failed to get section".to_string(),
        }),
    }
}

#[get("/section/{id}/topics")]
pub async fn all_section_topics(
    path: web::Path<(i32,)>,
) -> HttpResponse {
    let section_id = path.into_inner().0;
    let topics = get_forum_topics_from_section(section_id);

    HttpResponse::Ok().json(topics)
}

#[get("/topic/{id}")]
pub async fn get_topic(
    path: web::Path<(i32,)>,
) -> HttpResponse {
    let topic_id = path.into_inner().0;
    match get_forum_topic_from_id(topic_id) {
        Some(t) => HttpResponse::Ok().json(t),
        None => HttpResponse::NotFound().json(Message {
            message: "Failed to get topic".to_string(),
        }),
    }
}

#[get("/topic/{id}/latest_thread")]
pub async fn get_latest_thread_in_topic(
    path: web::Path<(i32,)>,
) -> HttpResponse {
    match get_latest_forum_thread_in_forum_topic_from_id(path.into_inner().0) {
        Some(thread) => {
            HttpResponse::Ok().json(thread)
        }
        None => {
            HttpResponse::NotFound().json(Message {
                message: "Failed to get latest thread".to_string()
            })
        }
    }
}

#[get("/topic/{id}/threads")]
pub async fn get_topic_threads(
    path: web::Path<(i32,)>,
) -> HttpResponse {
    let topic_id = path.into_inner().0;
    let threads = get_threads_in_forum_topic(topic_id);
    HttpResponse::Ok().json(threads)
}

#[get("/thread/count")]
pub async fn get_total_thread_count() -> HttpResponse {
    let threads = get_all_forum_threads();
    HttpResponse::Ok().json(ThreadCount {
        threads: threads.len(),
    })
}

#[get("/thread/{id}")]
pub async fn get_thread(
    path: web::Path<(i32,)>,
) -> HttpResponse {
    match get_forum_thread_from_id(path.into_inner().0) {
        Some(thread) => HttpResponse::Ok().json(thread),
        None => HttpResponse::NotFound().json(Message {
            message: "Failed to get thread".to_string(),
        }),
    }
}

#[get("/thread/{id}/posts")]
pub async fn get_posts_in_thread(
    path: web::Path<(i32,)>,
) -> HttpResponse {
    let posts = get_forum_posts_in_forum_thread(path.into_inner().0);
    HttpResponse::Ok().json(posts)
}

#[get("/thread/search")]
pub async fn thread_search(
    query: web::Query<SearchModel>,
) -> HttpResponse {
    let query_results = search_threads_with_page(query.search.clone(), query.page as i64);
    HttpResponse::Ok().json(query_results)
}

#[get("/post/{id}")]
pub async fn get_post(
    path: web::Path<(i32,)>,
) -> HttpResponse {
    match get_forum_post_from_id(path.into_inner().0) {
        Some(post) => HttpResponse::Ok().json(post),
        None => HttpResponse::NotFound().json(Message {
            message: "Failed to get post".to_string(),
        }),
    }
}

#[get("/post/count")]
pub async fn get_total_post_count() -> HttpResponse {
    let posts = get_all_forum_posts();
    HttpResponse::Ok().json(PostCount { posts: posts.len() })
}
