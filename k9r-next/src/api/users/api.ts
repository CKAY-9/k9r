import axios from "axios";
import { User } from "./models";
import { K9R_API } from "../resources";
import { Usergroup } from "../usergroups/models";
import { ForumPost, ForumThread } from "../forum/models";

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

export const getUserFromID = async (
	id: number,
	token?: string
): Promise<User | null> => {
	try {
		const request = await axios({
			url: `${K9R_API}/user/${id}`,
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

export const getUserUserGroupsFromID = async (
	id: number,
	token?: string
): Promise<Usergroup[]> => {
	try {
		const request = await axios({
			url: `${K9R_API}/user/${id}/usergroups`,
			method: "GET",
			headers: {
				Authorization: `${token}`,
			},
		});
		return request.data;
	} catch {
		return [];
	}
};

export const getUserCount = async (): Promise<number> => {
	try {
		const request = await axios({
			url: `${K9R_API}/user/count`,
			method: "GET",
		});
		return request.data.users;
	} catch {
		return 0;
	}
};

export const searchUsers = async (
	search: string,
	page?: number
): Promise<User[]> => {
	try {
		const request = await axios({
			url: `${K9R_API}/user/search`,
			method: "GET",
			params: {
				search: search,
				page: page ? page : 1,
			},
		});
		return request.data;
	} catch {
		return [];
	}
};

export const getThreadsPostedByUser = async (
	user_id: number
): Promise<ForumThread[]> => {
	try {
		const request = await axios({
			url: `${K9R_API}/user/${user_id}/threads`,
			method: "GET",
		});
		return request.data;
	} catch {
		return [];
	}
};

export const getPostsPostedByUser = async (
	user_id: number
): Promise<ForumPost[]> => {
	try {
		const request = await axios({
			url: `${K9R_API}/user/${user_id}/posts`,
			method: "GET",
		});
		return request.data;
	} catch {
		return [];
	}
};
