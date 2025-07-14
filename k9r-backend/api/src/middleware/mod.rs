use crate::{
    middleware::permissions::usergroups_match_permission,
    permissions::{
        MANAGE_COMMUNITY, MANAGE_DETAILS, MANAGE_FORUMS, MANAGE_POSTS,
        MANAGE_USERGROUPS, MANAGE_USERS, SITE_SETTINGS,
    },
};
use k9r_db::models::User;

pub mod features;
pub mod permissions;

pub fn has_general_management_permissions(user: &User) -> bool {
    usergroups_match_permission(
        user.usergroups.clone(),
        MANAGE_COMMUNITY
            | MANAGE_FORUMS
            | MANAGE_DETAILS
            | MANAGE_USERS
            | MANAGE_USERGROUPS
            | MANAGE_POSTS
            | SITE_SETTINGS,
    )
}
