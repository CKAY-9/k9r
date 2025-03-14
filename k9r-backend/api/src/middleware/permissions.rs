use actix_web::{
    body::MessageBody, dev::{ServiceRequest, ServiceResponse}, middleware::Next, Error, HttpMessage, HttpResponse
};
use k9r_db::crud::users::get_user_from_token;
use k9r_utils::extract_header_value;

use crate::models::Message;

pub async fn valid_user(
    req: ServiceRequest,
    next: Next<impl MessageBody + 'static>,
) -> Result<ServiceResponse<impl MessageBody + 'static>, Error> {
    let user_token_opt = extract_header_value(&req.request(), "Authorization");
    if user_token_opt.is_none() {
        return Ok(req.into_response(HttpResponse::BadRequest().json(Message {
            message: "No user token".to_string(),
        })));
    }

    let user_token = user_token_opt.unwrap();
    let user = get_user_from_token(user_token);
    match user {
        Some(u) => {
            req.extensions_mut().insert(u);
            let res = next.call(req).await?;
            Ok(res.map_into_boxed_body())            
        }
        None => {
            return Ok(req.into_response(HttpResponse::NotFound().json(Message {
                message: "Failed to get user".to_string()
            })))
        }
    }
}

pub async fn forum_management(
    req: ServiceRequest,
    next: Next<impl MessageBody + 'static>,
) -> Result<ServiceResponse<impl MessageBody + 'static>, Error> {
    let user_token_opt = extract_header_value(&req.request(), "Authorization");
    if user_token_opt.is_none() {
        return Ok(req.into_response(HttpResponse::BadRequest().json(Message {
            message: "No user token".to_string(),
        })));
    }

    let user_token = user_token_opt.unwrap();
    let user = get_user_from_token(user_token);
    match user {
        Some(u) => {
            req.extensions_mut().insert(u);
            let res = next.call(req).await?;
            Ok(res.map_into_boxed_body())            
        }
        None => {
            return Ok(req.into_response(HttpResponse::NotFound().json(Message {
                message: "Failed to get user".to_string()
            })))
        }
    }
}
