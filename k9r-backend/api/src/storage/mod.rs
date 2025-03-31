use std::sync::Arc;
use async_trait::async_trait;
use aws_sdk_s3::{primitives::ByteStream, Client};
use k9r_utils::get_env_var;
use thiserror::Error;

pub mod get;
pub mod post;
pub mod delete;

#[derive(Error, Debug)]
pub enum StorageError {
    #[error("File not found")]
    NotFound,
    #[error("Permission denied")]
    PermissionDenied,
    #[error("Unknown error: {0}")]
    Unknown(String),
}

#[async_trait]
pub trait StorageBackend: Send + Sync {
    async fn save_file(&self, data: Vec<u8>, filename: &str) -> Result<String, StorageError>;
    async fn get_file(&self, filename: &str) -> Result<Vec<u8>, StorageError>;
    async fn get_file_url(&self, filename: &str) -> Option<String>;
    async fn delete_file(&self, filename: &str) -> Result<(), StorageError>;
}

pub struct LocalStorage {
    pub base_path: String,
}

#[async_trait]
impl StorageBackend for LocalStorage {
    async fn save_file(&self, data: Vec<u8>, filename: &str) -> Result<String, StorageError> {
        let path = std::path::Path::new(&self.base_path).join(filename);
        tokio::fs::write(&path, data)
            .await
            .map_err(|e| StorageError::Unknown(e.to_string()))?;
        Ok(filename.to_string())
    }

    async fn get_file(&self, filename: &str) -> Result<Vec<u8>, StorageError> {
        let path = std::path::Path::new(&self.base_path).join(filename);
        tokio::fs::read(&path).await.map_err(|e| match e.kind() {
            std::io::ErrorKind::NotFound => StorageError::NotFound,
            std::io::ErrorKind::PermissionDenied => StorageError::PermissionDenied,
            _ => StorageError::Unknown(e.to_string()),
        })
    }

    async fn get_file_url(&self, filename: &str) -> Option<String> {
        Some(format!("/files/{}", filename))
    }

    async fn delete_file(&self, filename: &str) -> Result<(), StorageError> {
        let path = std::path::Path::new(&self.base_path).join(filename);
        tokio::fs::remove_file(&path).await.map_err(|e| match e.kind() {
            std::io::ErrorKind::NotFound => StorageError::NotFound,
            std::io::ErrorKind::PermissionDenied => StorageError::PermissionDenied,
            _ => StorageError::Unknown(e.to_string()),
        })
    }
}

pub struct S3Storage {
    pub client: aws_sdk_s3::Client,
    pub bucket_name: String,
    pub public_url_base: Option<String>,
}

#[async_trait]
impl StorageBackend for S3Storage {
    async fn save_file(&self, data: Vec<u8>, filename: &str) -> Result<String, StorageError> {
        let byte_stream = ByteStream::from(data);

        self.client
            .put_object()
            .bucket(&self.bucket_name)
            .key(filename)
            .body(byte_stream)
            .send()
            .await
            .map_err(|e| StorageError::Unknown(e.to_string()))?;

        Ok(filename.to_string())
    }

    async fn get_file(&self, filename: &str) -> Result<Vec<u8>, StorageError> {
        let response = self
            .client
            .get_object()
            .bucket(&self.bucket_name)
            .key(filename)
            .send()
            .await
            .map_err(|e| StorageError::Unknown(e.to_string()))?;

        let bytes = response
            .body
            .collect()
            .await
            .map_err(|e| StorageError::Unknown(e.to_string()))?
            .into_bytes();

        Ok(bytes.to_vec())
    }

    async fn get_file_url(&self, filename: &str) -> Option<String> {
        self.public_url_base
            .as_ref()
            .map(|base| format!("{}/{}", base, filename))
    }

    async fn delete_file(&self, filename: &str) -> Result<(), StorageError> {
        self.client
            .delete_object()
            .bucket(&self.bucket_name)
            .key(filename)
            .send()
            .await
            .map_err(|e| StorageError::Unknown(e.to_string()))?;
        Ok(())
    }
}

pub struct AppState {
    pub storage: Arc<dyn StorageBackend>,
}

pub fn sanitize_filename(filename: &str) -> String {
    filename
        .chars()
        .filter(|c| c.is_ascii_alphanumeric() || *c == '.' || *c == '-' || *c == '_')
        .collect()
}

pub async fn setup_storage() -> Arc<dyn StorageBackend> {
    match get_env_var("K9R_STORAGE_TYPE").as_str() {
        "s3" => {
            let shared_config: aws_types::sdk_config::SdkConfig = aws_config::from_env().load().await;
            let client = Client::new(&shared_config);
            
            Arc::new(S3Storage {
                client,
                bucket_name: std::env::var("K9R_S3_BUCKET").expect("S3_BUCKET must be set"),
                public_url_base: std::env::var("K9R_S3_PUBLIC_URL").ok(),
            })
        }
        _ => {
            let base_path = std::env::var("K9R_LOCAL_STORAGE_PATH").unwrap_or_else(|_| "./uploads".to_string());
            tokio::fs::create_dir_all(&base_path).await.unwrap();
            Arc::new(LocalStorage { base_path })
        }
    }
}