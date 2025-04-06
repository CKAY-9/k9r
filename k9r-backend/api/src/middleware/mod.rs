use k9r_db::models::User;
use crate::{
    middleware::permissions::usergroups_match_permission,
    permissions::{
        MANAGE_COMMUNITY, MANAGE_DETAILS, MANAGE_FORUMS, MANAGE_POSTS, MANAGE_STORE,
        MANAGE_USERGROUPS, MANAGE_USERS, SITE_SETTINGS,
    },
};

pub mod permissions;
pub mod features;

pub fn has_general_management_permissions(user: &User) -> bool {
    usergroups_match_permission(user.usergroups.clone(), MANAGE_COMMUNITY)
    || usergroups_match_permission(user.usergroups.clone(), MANAGE_FORUMS)
    || usergroups_match_permission(user.usergroups.clone(), MANAGE_DETAILS)
    || usergroups_match_permission(user.usergroups.clone(), MANAGE_STORE)
    || usergroups_match_permission(user.usergroups.clone(), MANAGE_USERS)
    || usergroups_match_permission(user.usergroups.clone(), MANAGE_USERGROUPS)
    || usergroups_match_permission(user.usergroups.clone(), MANAGE_POSTS)
    || usergroups_match_permission(user.usergroups.clone(), SITE_SETTINGS)
}