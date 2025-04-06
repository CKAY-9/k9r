use k9r_db::models::{SupportTicket, User};

use crate::middleware::has_general_management_permissions;

pub mod get;
pub mod post;
pub mod put;

pub fn has_support_ticket_access(user: &User, support_ticket: &SupportTicket) -> bool {
    user.id == support_ticket.creator || has_general_management_permissions(user)
}
