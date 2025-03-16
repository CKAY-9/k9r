use actix_web::{delete, web, HttpMessage, HttpRequest, HttpResponse, Responder};
use k9r_db::{crud::{forum_posts::{delete_forum_post_from_id, get_forum_post_from_id}, forum_threads::{get_forum_thread_from_id, update_forum_thread_from_id}}, models::User};

use crate::models::Message;

#[delete("/post/{id}")]
pub async fn delete_post(
    request: HttpRequest,
    path: web::Path<(i32, )>
) -> Result<impl Responder, Box<dyn std::error::Error>> {
    let user = match request.extensions().get::<User>().cloned() {
        Some(user) => user,
        None => {
            return Ok(HttpResponse::Unauthorized().json(Message {
                message: "Failed to get user".to_string(),
            }))
        }
    };

    let post_id = path.into_inner().0;
    match get_forum_post_from_id(post_id) {
        Some(post) => {
            match post.author == user.id {
                true => {
                    match delete_forum_post_from_id(post.id) {
                        true => {
                            let thread_option = get_forum_thread_from_id(post_id);
                            if thread_option.is_none() {
                                return Ok(HttpResponse::NotFound().json(Message {
                                    message: "Failed to get thread".to_string()
                                }));
                            }

                            let mut thread = thread_option.unwrap();
                            for (index, id) in thread.posts.iter().enumerate() {
                                if id == &post.id {
                                    thread.posts.remove(index);
                                    break;
                                }
                            }

                            let update = serde_json::from_str(serde_json::to_string(&thread).unwrap().as_str()).unwrap();
                            update_forum_thread_from_id(thread.id, update);

                            Ok(HttpResponse::Ok().json(thread))
                        },
                        false => {
                            Ok(HttpResponse::BadRequest().json(Message {
                                message: "Failed to delete forum post".to_string()
                            }))
                        }
                    }
                }
                false => {
                    Ok(HttpResponse::Unauthorized().json(Message {
                        message: "Invalid user".to_string()
                    }))
                }
            }
        }
        None => {
            Ok(HttpResponse::NotFound().json(Message {
                message: "Failed to get forum post".to_string()
            }))
        }
    }
}