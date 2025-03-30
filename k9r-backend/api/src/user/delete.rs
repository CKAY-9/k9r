use actix_web::{web, HttpMessage, HttpRequest, HttpResponse};
use k9r_db::{
    crud::{
        forum_posts::{delete_forum_post_from_id, get_forum_posts_from_user_id}, forum_threads::{delete_forum_thread_from_id, get_forum_threads_from_user_id}, usergroups::get_usergroup_from_id, users::{delete_user_from_id, get_user_from_id, update_user_from_id}
    },
    models::{NewUser, User},
};

use crate::models::Message;

pub async fn remove_usergroup_from_user(
    (request, path): (HttpRequest, web::Path<(i32, i32)>),
) -> HttpResponse {
    let _user = match request.extensions().get::<User>().cloned() {
        Some(user) => user,
        None => {
            return HttpResponse::Unauthorized().json(Message {
                message: "Failed to get user".to_string(),
            })
        }
    };

    let params = path.into_inner();
    let selected_user_option = get_user_from_id(params.0);
    if selected_user_option.is_none() {
        return HttpResponse::NotFound().json(Message {
            message: "Failed to find user".to_string(),
        });
    }

    let mut selected_user = selected_user_option.unwrap();
    let selected_usergroup_option = get_usergroup_from_id(params.1);
    if selected_usergroup_option.is_none() {
        return HttpResponse::NotFound().json(Message {
            message: "Failed to find usergroup".to_string(),
        });
    }

    let selected_usergroup = selected_usergroup_option.unwrap();
    if !selected_user.usergroups.contains(&selected_usergroup.id) {
        return HttpResponse::BadRequest().json(Message {
            message: "User isn't apart of usergroup".to_string(),
        });
    }

    for (index, usergroup) in selected_user.usergroups.iter().enumerate() {
        if usergroup == &selected_usergroup.id {
            selected_user.usergroups.remove(index);
            break;
        }
    }
    let update =
        serde_json::from_str::<NewUser>(serde_json::to_string(&selected_user).unwrap().as_str())
            .unwrap();
    match update_user_from_id(selected_user.id, update) {
        Some(user) => HttpResponse::Ok().json(user),
        None => HttpResponse::BadRequest().json(Message {
            message: "Failed to update user".to_string(),
        }),
    }
}

pub async fn delete_all_user_threads(
    request: HttpRequest
) -> HttpResponse {
    let user = match request.extensions().get::<User>().cloned() {
        Some(user) => user,
        None => {
            return HttpResponse::Unauthorized().json(Message {
                message: "Failed to get user".to_string(),
            })
        }
    };

    let threads = get_forum_threads_from_user_id(user.id);
    for thread in threads.iter() {
        delete_forum_thread_from_id(thread.id);
    }

    HttpResponse::Ok().json(Message {
        message: "Deleted threads".to_string()
    })
}

pub async fn delete_all_user_posts(
    request: HttpRequest
) -> HttpResponse {
    let user = match request.extensions().get::<User>().cloned() {
        Some(user) => user,
        None => {
            return HttpResponse::Unauthorized().json(Message {
                message: "Failed to get user".to_string(),
            })
        }
    };

    let posts = get_forum_posts_from_user_id(user.id);
    for post in posts.iter() {
        delete_forum_post_from_id(post.id);
    }

    HttpResponse::Ok().json(Message {
        message: "Deleted posts".to_string()
    })
}

pub async fn delete_user(
    request: HttpRequest
) -> HttpResponse {
    let user = match request.extensions().get::<User>().cloned() {
        Some(user) => user,
        None => {
            return HttpResponse::Unauthorized().json(Message {
                message: "Failed to get user".to_string(),
            })
        }
    };
    match delete_user_from_id(user.id) {
        true => {
            let posts = get_forum_posts_from_user_id(user.id);
            for post in posts.iter() {
                delete_forum_post_from_id(post.id);
            }
        
            let threads = get_forum_threads_from_user_id(user.id);
            for thread in threads.iter() {
                delete_forum_thread_from_id(thread.id);
            }

            HttpResponse::Ok().json(Message {
                message: "Deleted user".to_string()
            })
        }
        false => {
            HttpResponse::BadRequest().json(Message {
                message: "Failed to delete user".to_string()
            })
        }
    }
}