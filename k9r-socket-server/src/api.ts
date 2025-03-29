import axios, { AxiosResponse } from "axios";

export const K9R_BACKEND_HOST = process.env.K9R_BACKEND_HOST || "http://127.0.0.1:8080";
export const K9R_API = `${K9R_BACKEND_HOST}/api/v1`;

export const K9R_FRONTEND_HOST = process.env.K9R_FRONTEND_HOST || "http://127.0.0.1:3000";

export type GameServer = {
    id: number;
    name: string;
    description: string;
    game: "minecraft";
    server_key: string;
    host_address: string;
    latest_state: string;
};

export type User = {
    id: number;
    token: string;
    username: string;
    display_name: string;
    description: string;
    joined: string;
    oauth_type: string;
    followers: number[];
    following: number[];
    usergroups: number[];
    reputation: number;
    avatar: string;
    banner: string;
};

export const getAuthorizedServer = async (authorization: string): Promise<GameServer | null> => {
    try {
        const request: AxiosResponse<any> = await axios({
            url: `${K9R_API}/game_server/auth`,
            method: "GET",
            headers: {
                Authorization: authorization
            }
        });
        return request.data;
    } catch {
        return null;
    }
};

export const getPersonalUser = async (token: string): Promise<User | null> => {
	try {
		const request = await axios({
			url: `${K9R_API}/user`,
			method: "GET",
			headers: {
				Authorization: `${token}`,
			},
		});
		return request.data;
	} catch {
		return null;
	}
};
