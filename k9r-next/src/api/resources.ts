export const K9R_API_HOST = process.env.NEXT_PUBLIC_K9R_BACKEND_HOST || "http://127.0.0.1:8080";
export const K9R_API = `${K9R_API_HOST}/api/v1`;

export const K9R_WEBSOCKET_HOST = process.env.NEXT_PUBLIC_K9R_WEBSOCKET_HOST || "ws://127.0.0.1:8081";

// OAuth Providers
export const GITHUB_OAUTH = process.env.NEXT_PUBLIC_K9R_GITHUB_OAUTH;
export const DISCORD_OAUTH = process.env.NEXT_PUBLIC_K9R_DISCORD_OAUTH;