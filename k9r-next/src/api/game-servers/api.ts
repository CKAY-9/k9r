import axios from "axios";
import { GameServer } from "./models";
import { K9R_API } from "../resources";
import { getStoredCookie } from "@/utils/stored-cookies";
import { getCookie } from "@/utils/cookies";
import { getAnyToken } from "@/utils/token";

export const getGameServerFromID = async (
	game_server_id: number
): Promise<GameServer | null> => {
	try {
		const token = await getAnyToken()
		const request = await axios({
			url: `${K9R_API}/game_server/${game_server_id}`,
			method: "GET",
			headers: {
				Authorization: token
			}
		});
		return request.data;
	} catch {
		return null;
	}
};

export const getAllGameServers = async (): Promise<GameServer[]> => {
	try {
		const token = await getAnyToken()
		const request = await axios({
			url: `${K9R_API}/game_server/all`,
			method: "GET",
			headers: {
				Authorization: token
			}
		});
		return request.data;
	} catch {
		return [];
	}
};

export const createGameServer = async (
	game_server: GameServer,
	token: string
): Promise<GameServer | null> => {
	try {
		const request = await axios({
			url: `${K9R_API}/game_server`,
			method: "POST",
			headers: {
				Authorization: token,
			},
			data: game_server,
		});
		return request.data;
	} catch {
		return null;
	}
};

export const updateGameServerFromID = async (
	game_server_id: number,
	game_server_update: GameServer,
	token: string
): Promise<GameServer | null> => {
	try {
		const request = await axios({
			url: `${K9R_API}/game_server/${game_server_id}`,
			method: "PUT",
			headers: {
				Authorization: token,
			},
			data: game_server_update,
		});
		return request.data;
	} catch {
		return null;
	}
};

export const deleteGameServerFromID = async (
	game_server_id: number,
	token: string
): Promise<boolean> => {
	try {
		await axios({
			url: `${K9R_API}/game_server/${game_server_id}`,
			method: "DELETE",
			headers: {
				Authorization: token,
			},
		});
		return true;
	} catch {
		return false;
	}
};
