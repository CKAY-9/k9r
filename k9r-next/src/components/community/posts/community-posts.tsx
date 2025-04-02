"use client";

import { getLatestForumPosts } from "@/api/forum/api";
import { ForumPost } from "@/api/forum/models";
import LoadingAlert from "@/components/loading/loading-alert";
import { useEffect, useState } from "react";
import style from "./posts.module.scss";
import Link from "next/link";
import PostPreview from "@/components/forum/posts/post-preview";

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
							<Link
								style={{ borderBottom: "0" }}
								href={`/forum/topic/0/0`}
								key={index}
							>
								<PostPreview forum_post={post} compact={true} />
							</Link>
						);
					})}
					{recent_posts.length <= 0 && <span>No posts found...</span>}
				</div>
			)}
		</>
	);
};

export default CommunityPosts;
