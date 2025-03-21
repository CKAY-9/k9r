use actix_web::{web, HttpMessage, HttpRequest, HttpResponse};
use k9r_db::{
    crud::{
        usergroups::get_usergroup_from_id,
        users::{get_user_from_id, update_user_from_id},
    },
    models::{NewUser, User},
};

use crate::models::Message;

pub async fn add_usergroup_to_user(
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
    if selected_user.usergroups.contains(&selected_usergroup.id) {
        return HttpResponse::BadRequest().json(Message {
            message: "User already apart of usergroup".to_string(),
        });
    }

    selected_user.usergroups.push(selected_usergroup.id);
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
