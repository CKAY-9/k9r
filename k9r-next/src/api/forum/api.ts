import axios, { Axios, AxiosError } from "axios";
import { K9R_API } from "../resources";
import { ForumPost, ForumSection, ForumThread, ForumTopic } from "./models";

export const createNewForumThread = async (
	new_thread: ForumThread,
	new_post: ForumPost,
	token: string
): Promise<ForumThread | null> => {
	try {
		const request = await axios({
			url: `${K9R_API}/forum/new/thread`,
			method: "POST",
			headers: {	
				Authorization: token,
			},
			data: {
				new_thread: new_thread,
				new_post: new_post,
			},
		});
		return request.data;
	} catch {
		return null;
	}
};

export const getAllForumSections = async (): Promise<ForumSection[]> => {
	try {
		const request = await axios({
			url: `${K9R_API}/forum/section`,
			method: "GET",
		});
		return request.data;
	} catch {
		return [];
	}
};

export const getAllForumTopics = async (): Promise<ForumTopic[]> => {
	try {
		const request = await axios({
			url: `${K9R_API}/forum/topic`,
			method: "GET",
		});
		return request.data;
	} catch {
		return [];
	}
};

export const getForumSectionFromID = async (
	section_id: number
): Promise<ForumSection | null> => {
	try {
		const request = await axios({
			url: `${K9R_API}/forum/section/${section_id}`,
			method: "GET",
		});
		return request.data;
	} catch {
		return null;
	}
};

export const getForumSectionTopicsFromID = async (
	section_id: number
): Promise<ForumTopic[]> => {
	try {
		const request = await axios({
			url: `${K9R_API}/forum/section/${section_id}/topics`,
			method: "GET",
		});
		return request.data;
	} catch {
		return [];
	}
};

export const getForumTopicFromID = async (
	topic_id: number
): Promise<ForumTopic | null> => {
	try {
		const request = await axios({
			url: `${K9R_API}/forum/topic/${topic_id}`,
			method: "GET",
		});
		return request.data;
	} catch {
		return null;
	}
};

export const updateAllSections = async (sections: ForumSection[], token: string): Promise<ForumSection[]> => {
	try {
		const request = await axios({
			url: `${K9R_API}/forum/admin/section`,
			method: "PUT",
			headers: {
				Authorization: token
			},
			data: sections
		});
		return request.data;
	} catch {
		return [];
	}
}

export const updateAllTopics = async (topics: ForumTopic[], token: string): Promise<ForumTopic[]> => {
	try {
		const request = await axios({
			url: `${K9R_API}/forum/admin/topic`,
			method: "PUT",
			headers: {
				Authorization: token
			},
			data: topics
		});
		return request.data;
	} catch {
		return [];
	}
}