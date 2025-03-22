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
    permissions::{
        CREATE_NEW_POSTS, CREATE_NEW_THREADS, EDIT_POSTS, EDIT_THREADS, MANAGE_DETAILS, MANAGE_FORUMS, MANAGE_POSTS, MANAGE_USERGROUPS, MANAGE_USERS, ROOT_ACCESS
    },
};

fn usergroups_match_permission(usergroup_ids: Vec<i32>, permission: i32) -> bool {
    for usergroup_id in usergroup_ids.iter() {
        let usergroup_opt = get_usergroup_from_id(usergroup_id.to_owned());
        if usergroup_opt.is_none() {
            continue;
        }

        let usergroup = usergroup_opt.unwrap();
        if (usergroup.permissions & permission != 0) || (usergroup.permissions & ROOT_ACCESS != 0) {
            return true;
        }
    }

    false
}

pub async fn valid_user_middleware(
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

pub async fn forum_management_middleware(
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
        Some(user) => match usergroups_match_permission(user.clone().usergroups, MANAGE_FORUMS) {
            true => {
                req.extensions_mut().insert(user);
                let res = next.call(req).await?;
                return Ok(res.map_into_boxed_body());
            }
            false => Ok(
                req.into_response(HttpResponse::Unauthorized().json(Message {
                    message: "Invalid permissions".to_string(),
                })),
            ),
        },
        None => {
            return Ok(req.into_response(HttpResponse::NotFound().json(Message {
                message: "Failed to get user".to_string(),
            })))
        }
    }
}

pub async fn details_management_middleware(
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
        Some(user) => match usergroups_match_permission(user.clone().usergroups, MANAGE_DETAILS) {
            true => {
                req.extensions_mut().insert(user);
                let res = next.call(req).await?;
                return Ok(res.map_into_boxed_body());
            }
            false => Ok(
                req.into_response(HttpResponse::Unauthorized().json(Message {
                    message: "Invalid permissions".to_string(),
                })),
            ),
        },
        None => {
            return Ok(req.into_response(HttpResponse::NotFound().json(Message {
                message: "Failed to get user".to_string(),
            })))
        }
    }
}

pub async fn usergroup_management_middleware(
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
        Some(user) => match usergroups_match_permission(user.clone().usergroups, MANAGE_USERGROUPS)
        {
            true => {
                req.extensions_mut().insert(user);
                let res = next.call(req).await?;
                return Ok(res.map_into_boxed_body());
            }
            false => Ok(
                req.into_response(HttpResponse::Unauthorized().json(Message {
                    message: "Invalid permissions".to_string(),
                })),
            ),
        },
        None => {
            return Ok(req.into_response(HttpResponse::NotFound().json(Message {
                message: "Failed to get user".to_string(),
            })))
        }
    }
}

pub async fn user_management_middleware(
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
        Some(user) => match usergroups_match_permission(user.clone().usergroups, MANAGE_USERS)
        {
            true => {
                req.extensions_mut().insert(user);
                let res = next.call(req).await?;
                return Ok(res.map_into_boxed_body());
            }
            false => Ok(
                req.into_response(HttpResponse::Unauthorized().json(Message {
                    message: "Invalid permissions".to_string(),
                })),
            ),
        },
        None => {
            return Ok(req.into_response(HttpResponse::NotFound().json(Message {
                message: "Failed to get user".to_string(),
            })))
        }
    }
}

pub async fn thread_management_middleware(
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
        Some(user) => match usergroups_match_permission(user.clone().usergroups, MANAGE_POSTS)
        {
            true => {
                req.extensions_mut().insert(user);
                let res = next.call(req).await?;
                return Ok(res.map_into_boxed_body());
            }
            false => Ok(
                req.into_response(HttpResponse::Unauthorized().json(Message {
                    message: "Invalid permissions".to_string(),
                })),
            ),
        },
        None => {
            return Ok(req.into_response(HttpResponse::NotFound().json(Message {
                message: "Failed to get user".to_string(),
            })))
        }
    }
}

pub async fn create_new_thread_middleware(
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
            match usergroups_match_permission(user.clone().usergroups, CREATE_NEW_THREADS) {
                true => {
                    req.extensions_mut().insert(user);
                    let res = next.call(req).await?;
                    return Ok(res.map_into_boxed_body());
                }
                false => Ok(
                    req.into_response(HttpResponse::Unauthorized().json(Message {
                        message: "Invalid permissions".to_string(),
                    })),
                ),
            }
        }
        None => {
            return Ok(req.into_response(HttpResponse::NotFound().json(Message {
                message: "Failed to get user".to_string(),
            })))
        }
    }
}

pub async fn create_new_post_middleware(
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
            match usergroups_match_permission(user.clone().usergroups, CREATE_NEW_POSTS) {
                true => {
                    req.extensions_mut().insert(user);
                    let res = next.call(req).await?;
                    return Ok(res.map_into_boxed_body());
                }
                false => Ok(
                    req.into_response(HttpResponse::Unauthorized().json(Message {
                        message: "Invalid permissions".to_string(),
                    })),
                ),
            }
        }
        None => {
            return Ok(req.into_response(HttpResponse::NotFound().json(Message {
                message: "Failed to get user".to_string(),
            })))
        }
    }
}

pub async fn edit_thread_middleware(
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
        Some(user) => match usergroups_match_permission(user.clone().usergroups, EDIT_THREADS) {
            true => {
                req.extensions_mut().insert(user);
                let res = next.call(req).await?;
                return Ok(res.map_into_boxed_body());
            }
            false => Ok(
                req.into_response(HttpResponse::Unauthorized().json(Message {
                    message: "Invalid permissions".to_string(),
                })),
            ),
        },
        None => {
            return Ok(req.into_response(HttpResponse::NotFound().json(Message {
                message: "Failed to get user".to_string(),
            })))
        }
    }
}

pub async fn edit_post_middleware(
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
        Some(user) => match usergroups_match_permission(user.clone().usergroups, EDIT_POSTS) {
            true => {
                req.extensions_mut().insert(user);
                let res = next.call(req).await?;
                return Ok(res.map_into_boxed_body());
            }
            false => Ok(
                req.into_response(HttpResponse::Unauthorized().json(Message {
                    message: "Invalid permissions".to_string(),
                })),
            ),
        },
        None => {
            return Ok(req.into_response(HttpResponse::NotFound().json(Message {
                message: "Failed to get user".to_string(),
            })))
        }
    }
}
