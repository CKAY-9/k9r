use actix_web::{web, Error, HttpResponse};
use futures_util::StreamExt;
use uuid::Uuid;

use super::{sanitize_filename, AppState};

pub async fn save_file(
    mut payload: actix_multipart::Multipart,
    state: web::Data<AppState>,
) -> Result<HttpResponse, Error> {
    while let Some(item) = payload.next().await {
        let mut field = item?;
        let content_disposition = field.content_disposition();
        
        let filename = content_disposition
            .get_filename()
            .map_or_else(|| Uuid::new_v4().to_string(), |f| sanitize_filename(f));

        let mut buffer = Vec::new();
        while let Some(chunk) = field.next().await {
            let data = chunk?;
            buffer.extend_from_slice(&data);
        }

        if buffer.len() > 10 * 1024 * 1024 {
            return Ok(HttpResponse::BadRequest().json("File too large (max 10MB)"));
        }

        match state.storage.save_file(buffer, &filename).await {
            Ok(_) => {
                let file_url = state.storage.get_file_url(&filename).await;
                return Ok(HttpResponse::Ok().json(serde_json::json!({
                    "status": "success",
                    "filename": filename,
                    "url": file_url
                })));
            }
            Err(e) => {
                log::error!("Failed to save file: {}", e);
                return Ok(HttpResponse::InternalServerError().json("Failed to save file"));
            }
        }
    }

    Ok(HttpResponse::BadRequest().json("No file found in request"))
}