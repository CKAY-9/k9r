use actix_web::{web, HttpMessage, HttpRequest, HttpResponse};
use k9r_db::{crud::usergroups::{delete_usergroup_from_id, get_usergroup_from_id}, models::User};

use crate::models::Message;

pub async fn delete_usergroup_by_id(
    (request, path): (HttpRequest, web::Path<(i32, )>)
) -> HttpResponse {
    let _user = match request.extensions().get::<User>().cloned() {
        Some(user) => user,
        None => {
            return HttpResponse::Unauthorized().json(Message {
                message: "Failed to get user".to_string(),
            })
        }
    };

    let id = path.into_inner().0;
    let usergroup_option = get_usergroup_from_id(id);
    if usergroup_option.is_none() {
        return HttpResponse::NotFound().json(Message {
            message: "Failed to get usergroup".to_string()
        });
    }

    let usergroup = usergroup_option.unwrap();
    if usergroup.id == 1 || usergroup.id == 2 {
        return HttpResponse::BadRequest().json(Message {
            message: "Can't delete default usergroups".to_string()
        });
    }

    match delete_usergroup_from_id(id) {
        true => {
            HttpResponse::Ok().json(Message {
                message: "Deleted usergroup".to_string()
            })
        }
        false => {
            HttpResponse::BadRequest().json(Message {
                message: "Failed to delete usergroup".to_string()
            })
        }
    }
}