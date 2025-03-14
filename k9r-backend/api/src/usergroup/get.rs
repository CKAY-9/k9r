use actix_web::{get, http::StatusCode, web, HttpResponse, Responder};
use k9r_db::crud::usergroups::get_usergroup_from_id;

use crate::models::Message;

#[get("/{id}")]
pub async fn get_usergroup_by_id(
    path: web::Path<(i32,)>,
) -> Result<impl Responder, Box<dyn std::error::Error>> {
    let usergroup_id = path.into_inner().0;
    let usergroup = get_usergroup_from_id(usergroup_id);
    match usergroup {
        Some(ug) => {
            Ok(HttpResponse::Ok().json(ug))
        }
        None => {
            Ok(HttpResponse::Ok().status(StatusCode::NOT_FOUND).json(Message {
                message: "Failed to get usergroup".to_string()
            }))
        }
    }
}
