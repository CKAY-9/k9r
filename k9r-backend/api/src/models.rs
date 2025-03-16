use serde::{Deserialize, Serialize};

#[derive(Serialize, Deserialize)]
pub struct Message {
    pub message: String,
}

#[derive(Deserialize, Debug)]
pub struct SearchModel {
    pub search: String,
    pub page: usize
}