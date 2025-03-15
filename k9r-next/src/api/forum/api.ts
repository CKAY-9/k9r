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
			url: `${K9R_API}/forum/thread`,
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

export const createNewForumPost = async (
	new_post: ForumPost,
	token: string
): Promise<ForumPost | null> => {
	try {
		const request = await axios({
			url: `${K9R_API}/forum/post`,
			method: "POST",
			headers: {
				Authorization: token
			},
			data: new_post
		});
		return request.data;
	} catch {
		return null;
	}
}

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

export const getForumThreadCount = async (): Promise<number> => {
    try {
        const request = await axios({
            url: `${K9R_API}/forum/thread/count`,
            method: "GET"
        });
        return request.data.threads;
    } catch {
        return 0;
    }
}

export const getForumThreadsInForumTopicFromID = async (topic_id: number): Promise<ForumThread[]> => {
	try {
		const request = await axios({
			url: `${K9R_API}/forum/topic/${topic_id}/threads`,
			method: "GET"
		});
		return request.data;
	} catch {
		return [];
	}
}

export const getForumThreadFromID = async (id: number): Promise<ForumThread | null> => {
	try {
		const request = await axios({
			url: `${K9R_API}/forum/thread/${id}`,
			method: "GET"
		});
		return request.data;
	} catch {
		return null;
	}
}

export const getForumPostsFromForumThreadID = async (thread_id: number): Promise<ForumPost[]> => {
	try {
		const request = await axios({
			url: `${K9R_API}/forum/thread/${thread_id}/posts`,
			method: "GET"
		});
		return request.data;
	} catch {
		return [];
	}
}

export const getForumPostFromID = async (id: number): Promise<ForumPost | null> => {
	try {
		const request = await axios({
			url: `${K9R_API}/forum/post/${id}`,
			method: "GET"
		});
		return request.data;
	} catch {
		return null;
	}
}