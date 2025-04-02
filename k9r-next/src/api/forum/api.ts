import axios from "axios";
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
				Authorization: token,
			},
			data: new_post,
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

export const getLatestForumThreadInForumTopic = async (topic_id: number): Promise<ForumThread | null> => {
	try {
		const request = await axios({
			url: `${K9R_API}/forum/topic/${topic_id}/latest_thread`,
			method: "GET",
		});
		return request.data;
	} catch {
		return null;
	}
};

export const getLatestForumPosts = async (): Promise<ForumPost[]> => {
	try {
		const request = await axios({
			url: `${K9R_API}/forum/recent_posts`,
			method: "GET"
		});
		return request.data;
	} catch {
		return [];
	}
}

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

export const updateAllSections = async (
	sections: ForumSection[],
	token: string
): Promise<ForumSection[]> => {
	try {
		const request = await axios({
			url: `${K9R_API}/forum/admin/section`,
			method: "PUT",
			headers: {
				Authorization: token,
			},
			data: sections,
		});
		return request.data;
	} catch {
		return [];
	}
};

export const updateAllTopics = async (
	topics: ForumTopic[],
	token: string
): Promise<ForumTopic[]> => {
	try {
		const request = await axios({
			url: `${K9R_API}/forum/admin/topic`,
			method: "PUT",
			headers: {
				Authorization: token,
			},
			data: topics,
		});
		return request.data;
	} catch {
		return [];
	}
};

export const getForumThreadCount = async (): Promise<number> => {
	try {
		const request = await axios({
			url: `${K9R_API}/forum/thread/count`,
			method: "GET",
		});
		return request.data.threads;
	} catch {
		return 0;
	}
};

export const getForumPostCount = async (): Promise<number> => {
	try {
		const request = await axios({
			url: `${K9R_API}/forum/post/count`,
			method: "GET",
		});
		return request.data.posts;
	} catch {
		return 0;
	}
};

export const getForumThreadsInForumTopicFromID = async (
	topic_id: number
): Promise<ForumThread[]> => {
	try {
		const request = await axios({
			url: `${K9R_API}/forum/topic/${topic_id}/threads`,
			method: "GET",
		});
		console.log(request.data);
		return request.data;
	} catch {
		return [];
	}
};

export const getForumThreadFromID = async (
	id: number
): Promise<ForumThread | null> => {
	try {
		const request = await axios({
			url: `${K9R_API}/forum/thread/${id}`,
			method: "GET",
		});
		return request.data;
	} catch (ex) {
		return null;
	}
};

export const getForumPostsFromForumThreadID = async (
	thread_id: number
): Promise<ForumPost[]> => {
	try {
		const request = await axios({
			url: `${K9R_API}/forum/thread/${thread_id}/posts`,
			method: "GET",
		});
		return request.data;
	} catch {
		return [];
	}
};

export const getForumPostFromID = async (
	id: number
): Promise<ForumPost | null> => {
	try {
		const request = await axios({
			url: `${K9R_API}/forum/post/${id}`,
			method: "GET",
		});
		return request.data;
	} catch {
		return null;
	}
};

export const updateForumPostFromID = async (
	id: number,
	forum_post: ForumPost,
	token: string
): Promise<ForumPost | null> => {
	try {
		const request = await axios({
			url: `${K9R_API}/forum/post`,
			method: "PUT",
			headers: {
				Authorization: token,
			},
			data: forum_post,
		});
		return request.data;
	} catch {
		return null;
	}
};

export const updateForumThreadFromID = async (
	id: number,
	forum_thread: ForumThread,
	token: string
): Promise<ForumPost | null> => {
	try {
		const request = await axios({
			url: `${K9R_API}/forum/thread`,
			method: "PUT",
			headers: {
				Authorization: token,
			},
			data: forum_thread,
		});
		return request.data;
	} catch {
		return null;
	}
};

export const deleteForumPostFromID = async (
	id: number,
	token: string
): Promise<boolean> => {
	try {
		await axios({
			url: `${K9R_API}/forum/post/${id}`,
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

export const deleteForumThreadFromID = async (
	id: number,
	token: string
): Promise<boolean> => {
	try {
		await axios({
			url: `${K9R_API}/forum/thread/${id}`,
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

export const searchThreads = async (
	search: string,
	page?: number
): Promise<ForumThread[]> => {
	try {
		const request = await axios({
			url: `${K9R_API}/forum/thread/search`,
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

export const toggleThreadLock = async (
	thread_id: number,
	token: string
): Promise<boolean> => {
	try {
		const request = await axios({
			url: `${K9R_API}/forum/thread/${thread_id}/lock`,
			method: "PUT",
			headers: {
				Authorization: token,
			},
		});
		return request.data.locked;
	} catch {
		return false;
	}
};

export const toggleThreadSticky = async (
	thread_id: number,
	token: string
): Promise<boolean> => {
	try {
		const request = await axios({
			url: `${K9R_API}/forum/thread/${thread_id}/sticky`,
			method: "PUT",
			headers: {
				Authorization: token,
			},
		});
		return request.data.sticky;
	} catch {
		return false;
	}
};

export const likePost = async (
	state: -1 | 0 | 1,
	post_id: number,
	token: string
): Promise<ForumPost | null> => {
	try {
		const request = await axios({
			url: `${K9R_API}/forum/post/${post_id}/like`,
			method: "POST",
			headers: {
				Authorization: token,
			},
			data: {
				state: state,
			},
		});
		return request.data;
	} catch {
		return null;
	}
};

export const likeThread = async (
	state: -1 | 0 | 1,
	thread_id: number,
	token: string
): Promise<ForumPost | null> => {
	try {
		const request = await axios({
			url: `${K9R_API}/forum/thread/${thread_id}/like`,
			method: "POST",
			headers: {
				Authorization: token,
			},
			data: {
				state: state,
			},
		});
		return request.data;
	} catch {
		return null;
	}
};

export const deleteAllUserThreads = async (
	token: string
): Promise<boolean> => {
	try {
		const request = await axios({
			url: `${K9R_API}/user/threads`,
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

export const deleteAllUserPosts = async (
	token: string
): Promise<boolean> => {
	try {
		const request = await axios({
			url: `${K9R_API}/user/posts`,
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