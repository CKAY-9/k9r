"use client";

import { ForumPost, ForumThread } from "@/api/forum/models";
import { getUserFromID } from "@/api/users/api";
import { User } from "@/api/users/models";
import { useEffect, useState } from "react";
import style from "./post.module.scss";
import UserTab from "@/components/user/user-tab/user-tab";
import { getForumThreadFromID } from "@/api/forum/api";
import { calcTimeSinceMillis } from "@/utils/time-ago";

type PostPreviewProps = {
	forum_post: ForumPost;
	compact?: boolean;
};

const PostPreview = (props: PostPreviewProps) => {
	const [author, setAuthor] = useState<User | null>(null);
	const [created, setCreated] = useState<string>("");
	const [updated, setUpdated] = useState<string>("");
	const [thread, setThread] = useState<ForumThread | null>(null);

	useEffect(() => {
		const c = new Date(props.forum_post.created).toLocaleString();
		setCreated(c);

		const u = new Date(props.forum_post.updated).toLocaleString();
		setUpdated(u);

		(async () => {
			const a = await getUserFromID(props.forum_post.author);
			setAuthor(a);

			const t = await getForumThreadFromID(props.forum_post.thread);
			setThread(t);
		})();
	}, [
		props.forum_post.author,
		props.forum_post.created,
		props.forum_post.thread,
		props.forum_post.updated,
	]);

	if (props.compact) {
		return (
			<div className={style.compact_preview}>
				{thread && (
					<section>
						<span>Posted to {thread.title}</span>
					</section>
				)}
				<p>{props.forum_post.content}</p>
				{author && (
					<section>
						<UserTab user={author} />
					</section>
				)}
				<span>{calcTimeSinceMillis((new Date(props.forum_post.created)).getTime(), (new Date()).getTime())} ago</span>
			</div>
		);
	}

	return (
		<div className={style.post_preview}>
			<span>{props.forum_post.content}</span>
			{thread !== null && (
				<span style={{ opacity: "0.5" }}>Posted to {thread.title}</span>
			)}
			<section className={style.times}>
				{author !== null && <UserTab user={author} />}
				<span className={style.time}>Posted: {created}</span>
				{created !== updated && (
					<span className={style.time}>Updated: {updated}</span>
				)}
			</section>
		</div>
	);
};

export default PostPreview;
