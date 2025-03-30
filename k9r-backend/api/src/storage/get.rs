use actix_web::{web, Error, HttpResponse};
use serde_json::json;

use super::{AppState, StorageError};

pub async fn get_file(
    filename: web::Path<String>,
    state: web::Data<AppState>,
) -> Result<HttpResponse, Error> {
    match state.storage.get_file(&filename).await {
        Ok(data) => {
            let content_type = mime_guess::from_path(filename.clone())
                .first_or_octet_stream();
                
            Ok(HttpResponse::Ok()
                .content_type(content_type.to_string())
                .body(data))
        }
        Err(StorageError::NotFound) => Ok(HttpResponse::NotFound().finish()),
        Err(e) => {
            log::error!("Failed to get file: {}", e);
            Ok(HttpResponse::InternalServerError().finish())
        }
    }
}

pub async fn get_file_url(
    filename: web::Path<String>,
    state: web::Data<AppState>,
) -> Result<HttpResponse, Error> {
    match state.storage.get_file_url(&filename).await {
        Some(url) => Ok(HttpResponse::Ok().json(json!({ "url": url }))),
        None => Ok(HttpResponse::NotFound().json("URL not available for this file")),
    }
}
