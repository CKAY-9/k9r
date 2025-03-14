use actix_web::{put, web, HttpRequest, HttpResponse, Responder};
use k9r_db::{
    crud::{
        forum_sections::{create_forum_section, update_forum_section_from_id},
        forum_topics::{create_forum_topic, update_forum_topic_from_id},
    },
    models::{ForumSection, ForumTopic, NewForumSection, NewForumTopic},
};

#[put("/section")]
pub async fn update_all_sections(
    _request: HttpRequest,
    data: web::Json<Vec<ForumSection>>,
) -> Result<impl Responder, Box<dyn std::error::Error>> {
    let updated_sections = data.into_inner();
    let mut finished_sections: Vec<ForumSection> = Vec::new();

    for section in updated_sections.iter() {
        let update = serde_json::from_str::<NewForumSection>(
            serde_json::to_string(&section).unwrap().as_str(),
        )
        .unwrap();

        if section.id <= 0 {
            // insert
            match create_forum_section(update) {
                Some(s) => {
                    finished_sections.push(s);
                }
                None => {}
            }
        } else {
            match update_forum_section_from_id(section.id, update) {
                Some(s) => {
                    finished_sections.push(s);
                }
                None => {}
            }
        }
    }

    Ok(HttpResponse::Ok().json(finished_sections))
}

#[put("/topic")]
pub async fn update_all_topics(
    _request: HttpRequest,
    data: web::Json<Vec<ForumTopic>>,
) -> Result<impl Responder, Box<dyn std::error::Error>> {
    let updated_topics = data.into_inner();
    let mut finished_topics: Vec<ForumTopic> = Vec::new();

    for forum_topic in updated_topics.iter() {
        let update =
            serde_json::from_str::<NewForumTopic>(serde_json::to_string(&forum_topic).unwrap().as_str())
                .unwrap();

        if forum_topic.id <= 0 {
            // insert
            match create_forum_topic(update) {
                Some(t) => {
                    finished_topics.push(t);
                }
                None => {}
            }
        } else {
            match update_forum_topic_from_id(forum_topic.id, update) {
                Some(t) => {
                    finished_topics.push(t);
                }
                None => {}
            }
        }
    }

    Ok(HttpResponse::Ok().json(finished_topics))
}
