"use client";

import { getForumThreadFromID, getLatestForumPosts } from "@/api/forum/api";
import { ForumPost, ForumThread } from "@/api/forum/models";
import LoadingAlert from "@/components/loading/loading-alert";
import { useEffect, useState } from "react";
import style from "./posts.module.scss";
import Link from "next/link";
import PostPreview from "@/components/forum/posts/post-preview";

type PostProps = {
	post: ForumPost;
}

const Post = (props: PostProps) => {
	const [thread, setThread] = useState<ForumThread | null>(null);

	useEffect(() => {
		(async () => {
			const t = await getForumThreadFromID(props.post.thread);
			setThread(t);
		})();
	}, [props.post.thread]);

	if (!thread) {
		return <></>
	}

	return (
		<Link
			style={{ borderBottom: "0" }}
			href={`/forum/thread/${thread.id}#${props.post.id}`}
		>
			<PostPreview forum_post={props.post} compact={true} />
		</Link>
	)
}

const CommunityPosts = () => {
	const [recent_posts, setRecentPosts] = useState<ForumPost[]>([]);
	const [loading, setLoading] = useState<boolean>(true);

	useEffect(() => {
		(async () => {
			const posts_response = await getLatestForumPosts();
			setRecentPosts(posts_response);

            setLoading(false);
		})();
	}, []);

	return (
		<>
			<h2>Recent Posts</h2>
			{loading ? (
				<LoadingAlert message="Loading recent posts..." />
			) : (
				<div className={style.posts}>
					{recent_posts.map((post, index) => {
						return (
							<Post post={post} key={index} />
						);
					})}
					{recent_posts.length <= 0 && <span>No posts found...</span>}
				</div>
			)}
		</>
	);
};

export default CommunityPosts;
