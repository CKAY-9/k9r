use actix_web::{web, Error, HttpResponse};
use crate::models::Message;
use super::AppState;

pub async fn delete_file(
    filename: web::Path<String>,
    state: web::Data<AppState>,
) -> Result<HttpResponse, Error> {
    match state.storage.delete_file(&filename).await {
        Ok(()) => {
            Ok(HttpResponse::Ok().json(Message {
                message: "Deleted file".to_string()
            }))
        }
        Err(e) => {
            log::error!("Failed to get file: {}", e);
            Ok(HttpResponse::InternalServerError().finish())
        }
    }
}