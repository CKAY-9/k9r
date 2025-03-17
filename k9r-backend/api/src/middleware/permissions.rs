use actix_web::{
    body::MessageBody,
    dev::{ServiceRequest, ServiceResponse},
    middleware::Next,
    Error, HttpMessage, HttpResponse,
};
use k9r_db::crud::{usergroups::get_usergroup_from_id, users::get_user_from_token};
use k9r_utils::extract_header_value;

use crate::{
    models::Message,
    permissions::{MANAGE_DETAILS, MANAGE_FORUMS, ROOT_ACCESS},
};

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
                message: "Failed to get user".to_string(),
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
    match get_user_from_token(user_token) {
        Some(user) => {
            for usergroup_id in user.usergroups.iter() {
                let usergroup_opt = get_usergroup_from_id(usergroup_id.to_owned());
                if usergroup_opt.is_none() {
                    continue;
                }

                let usergroup = usergroup_opt.unwrap();
                if (usergroup.permissions & MANAGE_FORUMS != 0)
                    || (usergroup.permissions & ROOT_ACCESS != 0)
                {
                    req.extensions_mut().insert(user);
                    let res = next.call(req).await?;
                    return Ok(res.map_into_boxed_body());
                }
            }

            Ok(
                req.into_response(HttpResponse::Unauthorized().json(Message {
                    message: "Invalid permissions".to_string(),
                })),
            )
        }
        None => {
            return Ok(req.into_response(HttpResponse::NotFound().json(Message {
                message: "Failed to get user".to_string(),
            })))
        }
    }
}

pub async fn details_management(
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
    match get_user_from_token(user_token) {
        Some(user) => {
            for usergroup_id in user.usergroups.iter() {
                let usergroup_opt = get_usergroup_from_id(usergroup_id.to_owned());
                if usergroup_opt.is_none() {
                    continue;
                }

                let usergroup = usergroup_opt.unwrap();
                if (usergroup.permissions & MANAGE_DETAILS != 0)
                    || (usergroup.permissions & ROOT_ACCESS != 0)
                {
                    req.extensions_mut().insert(user);
                    let res = next.call(req).await?;
                    return Ok(res.map_into_boxed_body());
                }
            }

            Ok(
                req.into_response(HttpResponse::Unauthorized().json(Message {
                    message: "Invalid permissions".to_string(),
                })),
            )
        }
        None => {
            return Ok(req.into_response(HttpResponse::NotFound().json(Message {
                message: "Failed to get user".to_string(),
            })))
        }
    }
}
