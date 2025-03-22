use actix_web::{web, HttpMessage, HttpRequest, HttpResponse};
use k9r_db::{crud::{forum_posts::{delete_forum_post_from_id, get_forum_post_from_id, get_forum_posts_in_forum_thread}, forum_threads::{delete_forum_thread_from_id, get_forum_thread_from_id, update_forum_thread_from_id}}, models::User};

use crate::models::Message;

pub async fn delete_post(
    (request, path): (HttpRequest, web::Path<(i32, )>),
) -> HttpResponse {
    let user = match request.extensions().get::<User>().cloned() {
        Some(user) => user,
        None => {
            return HttpResponse::Unauthorized().json(Message {
                message: "Failed to get user".to_string(),
            });
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
                                return HttpResponse::NotFound().json(Message {
                                    message: "Failed to get thread".to_string()
                                });
                            }

                            let mut thread = thread_option.unwrap();
                            if thread.locked {
                                return HttpResponse::BadRequest().json(Message { 
                                    message: "Can't update a locked thread".to_string()
                                });
                            }

                            for (index, id) in thread.posts.iter().enumerate() {
                                if id == &post.id {
                                    thread.posts.remove(index);
                                    break;
                                }
                            }

                            let update = serde_json::from_str(serde_json::to_string(&thread).unwrap().as_str()).unwrap();
                            update_forum_thread_from_id(thread.id, update);

                            HttpResponse::Ok().json(thread)
                        },
                        false => {
                            HttpResponse::BadRequest().json(Message {
                                message: "Failed to delete forum post".to_string()
                            })
                        }
                    }
                }
                false => {
                    HttpResponse::Unauthorized().json(Message {
                        message: "Invalid user".to_string()
                    })
                }
            }
        }
        None => {
            HttpResponse::NotFound().json(Message {
                message: "Failed to get forum post".to_string()
            })
        }
    }
}

pub async fn delete_thread(
    (request, path): (HttpRequest, web::Path<(i32, )>)
) -> HttpResponse {
    let user = match request.extensions().get::<User>().cloned() {
        Some(user) => user,
        None => {
            return HttpResponse::Unauthorized().json(Message {
                message: "Failed to get user".to_string(),
            });
        }
    };

    let thread_id = path.into_inner().0;
    match get_forum_thread_from_id(thread_id) {
        Some(thread) => {
            if thread.locked {
                return HttpResponse::BadRequest().json(Message { 
                    message: "Can't update a locked thread".to_string()
                });
            }

            match thread.author == user.id {
                true => {
                    match delete_forum_thread_from_id(thread.id) {
                        true => {
                            let posts = get_forum_posts_in_forum_thread(thread_id);
                            for post in posts.iter() {
                                delete_forum_post_from_id(post.id);
                            }

                            HttpResponse::Ok().json(Message {
                                message: "Deleted forum thread".to_string()
                            })
                        },
                        false => {
                            HttpResponse::BadRequest().json(Message {
                                message: "Failed to delete forum thread".to_string()
                            })
                        }
                    }
                }
                false => {
                    HttpResponse::Unauthorized().json(Message {
                        message: "Invalid user".to_string()
                    })
                }
            }
        }
        None => {
            HttpResponse::NotFound().json(Message {
                message: "Failed to get forum thread".to_string()
            })
        }
    }
}