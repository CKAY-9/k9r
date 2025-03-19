/*

    Routes and Middleware are waterfalls.
    Things applied at the top of a service effect ones below it.
    For this reason, structure routes from least to most privileged
    Additionally, for routes like user, /{id} routes should be called last when possible
*/

use actix_web::{guard, middleware::from_fn, web};
use community::{get::get_community_details, put::update_community_details};
use forum::{
    delete::{delete_post, delete_thread},
    get::{
        all_forum_sections, all_section_topics, all_topics, get_post, get_posts_in_thread,
        get_section, get_thread, get_topic, get_topic_threads, get_total_post_count,
        get_total_thread_count, thread_search,
    },
    post::{new_forum_post, new_forum_section, new_forum_thread, new_forum_topic},
    put::{update_all_sections, update_all_topics, update_post, update_thread},
};
use middleware::permissions::{create_new_post_middleware, create_new_thread_middleware, details_management_middleware, edit_post_middleware, edit_thread_middleware, forum_management_middleware, valid_user_middleware};
use user::get::{
    get_personal_user, get_posts_posted_by_user, get_threads_posted_by_user, get_user_by_id,
    get_user_count, get_user_usergroups_by_id, login_with_discord, login_with_github, user_search,
};

pub mod community;
pub mod forum;
pub mod middleware;
pub mod models;
pub mod permissions;
pub mod user;
pub mod usergroup;

pub fn configure_api(cfg: &mut web::ServiceConfig) {
    cfg.service(
        web::scope("/api/v1")
            .configure(configure_community_routes)
            .configure(configure_user_routes)
            .configure(configure_usergroup_routes)
            .configure(configure_forum_routes),
    );
}

fn configure_community_routes(cfg: &mut web::ServiceConfig) {
    cfg.service(
        web::scope("/community")
            .service(get_community_details)
            .service(
                web::scope("")
                    .wrap(from_fn(details_management_middleware))
                    .service(update_community_details)
                    .guard(guard::Get()),
            ),
    );
}

fn configure_forum_routes(cfg: &mut web::ServiceConfig) {
    cfg.service(
        web::scope("/forum")
            .service(get_total_thread_count)
            .service(get_total_post_count)
            .service(all_forum_sections)
            .service(get_section)
            .service(all_section_topics)
            .service(get_topic)
            .service(all_topics)
            .service(thread_search)
            .service(get_thread)
            .service(get_post)
            .service(get_posts_in_thread)
            .service(get_topic_threads)
            .service(
                web::scope("")
                    .wrap(from_fn(valid_user_middleware))
                    .service(
                        web::scope("")
                            .wrap(from_fn(create_new_thread_middleware))
                            .service(new_forum_thread)
                            .guard(guard::Get())   
                    )
                    .service(
                        web::scope("")
                            .wrap(from_fn(create_new_post_middleware))
                            .service(new_forum_post)
                            .guard(guard::Get())   
                    )
                    .service(
                        web::scope("")
                            .wrap(from_fn(edit_thread_middleware))
                            .service(update_thread)
                            .service(delete_thread)
                            .guard(guard::Get())   
                    )
                    .service(
                        web::scope("")
                            .wrap(from_fn(edit_post_middleware))
                            .service(update_post)
                            .service(delete_post)
                            .guard(guard::Get())
                    )
                    .service(
                        web::scope("/admin")
                            .wrap(from_fn(forum_management_middleware))
                            .service(new_forum_section)
                            .service(update_all_sections)
                            .service(new_forum_topic)
                            .service(update_all_topics)
                            .guard(guard::Get()),
                    ),
            ),
    );
}

fn configure_user_routes(cfg: &mut web::ServiceConfig) {
    cfg.service(
        web::scope("/user")
            .service(login_with_discord)
            .service(login_with_github)
            .service(get_user_count)
            .service(get_posts_posted_by_user)
            .service(get_threads_posted_by_user)
            .service(user_search)
            .service(get_user_by_id)
            .service(get_personal_user)
            .service(get_user_usergroups_by_id),
    );
}

fn configure_usergroup_routes(cfg: &mut web::ServiceConfig) {
    cfg.service(web::scope("/usergroups"));
}
