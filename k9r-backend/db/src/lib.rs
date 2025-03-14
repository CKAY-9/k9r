use diesel::{Connection, PgConnection};
use dotenvy::dotenv;
use k9r_utils::get_env_var;

pub mod schema;
pub mod models;
pub mod crud;

pub fn create_connection() -> PgConnection {
    dotenv().ok();

    let database_url: String = get_env_var("DATABASE_URL");
    PgConnection::establish(database_url.as_str()).unwrap_or_else(|_|
        panic!("Error connecting to {}", database_url)
    )
}