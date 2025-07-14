use actix_web::{
    body::MessageBody,
    dev::{ServiceRequest, ServiceResponse},
    middleware::Next,
    Error, HttpResponse,
};
use k9r_db::crud::{community_details::get_community_details_from_id, users::get_user_from_token};
use k9r_utils::extract_header_value;

use crate::{
    models::Message,
    permissions::{MANAGE_COMMUNITY, MANAGE_FORUMS},
};

use super::permissions::usergroups_match_permission;

pub const FORUM_FEATURE: usize = 0;
pub const COMMUNITY_FEATURE: usize = 1;

pub async fn forum_feature_access(
    req: ServiceRequest,
    next: Next<impl MessageBody + 'static>,
) -> Result<ServiceResponse<impl MessageBody + 'static>, Error> {
    let community_details = get_community_details_from_id(1).unwrap();
    let user_token_opt = extract_header_value(&req.request(), "Authorization");
    if !community_details.features[FORUM_FEATURE] {
        if user_token_opt.is_none() {
            return Ok(req.into_response(HttpResponse::BadRequest().json(Message {
                message: "No token provided.".to_string(),
            })));
        }

        let user_token = user_token_opt.unwrap();
        let user = get_user_from_token(user_token);

        match user {
            Some(user) => match usergroups_match_permission(user.clone().usergroups, MANAGE_FORUMS)
            {
                true => {
                    let res = next.call(req).await?;
                    return Ok(res.map_into_boxed_body());
                }
                false => {
                    return Ok(
                        req.into_response(HttpResponse::Unauthorized().json(Message {
                            message: "Invalid permissions".to_string(),
                        })),
                    )
                }
            },
            None => {
                return Ok(req.into_response(HttpResponse::NotFound().json(Message {
                    message: "Failed to get user".to_string(),
                })));
            }
        }
    }

    let res = next.call(req).await?;
    return Ok(res.map_into_boxed_body());
}

pub async fn community_feature_access(
    req: ServiceRequest,
    next: Next<impl MessageBody + 'static>,
) -> Result<ServiceResponse<impl MessageBody + 'static>, Error> {
    let community_details = get_community_details_from_id(1).unwrap();
    let user_token_opt = extract_header_value(&req.request(), "Authorization");
    if !community_details.features[COMMUNITY_FEATURE] {
        if user_token_opt.is_none() {
            return Ok(req.into_response(HttpResponse::BadRequest().json(Message {
                message: "No token provided.".to_string(),
            })));
        }

        let user_token = user_token_opt.unwrap();
        let user = get_user_from_token(user_token);

        match user {
            Some(user) => {
                match usergroups_match_permission(user.clone().usergroups, MANAGE_COMMUNITY) {
                    true => {
                        let res = next.call(req).await?;
                        return Ok(res.map_into_boxed_body());
                    }
                    false => {
                        return Ok(
                            req.into_response(HttpResponse::Unauthorized().json(Message {
                                message: "Invalid permissions".to_string(),
                            })),
                        )
                    }
                }
            }
            None => {
                return Ok(req.into_response(HttpResponse::NotFound().json(Message {
                    message: "Failed to get user".to_string(),
                })));
            }
        }
    }

    let res = next.call(req).await?;
    return Ok(res.map_into_boxed_body());
}
