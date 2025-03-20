"use client";

import { ForumPost, ForumThread } from "@/api/forum/models";
import style from "./threads.module.scss";
import { useEffect, useState } from "react";
import { User } from "@/api/users/models";
import { getUserFromID } from "@/api/users/api";
import UserTab from "@/components/user/user-tab/user-tab";
import { getForumPostFromID } from "@/api/forum/api";

type ThreadPreviewProps = {
	forum_thread: ForumThread;
};

const ThreadPreview = (props: ThreadPreviewProps) => {
	const [author, setAuthor] = useState<User | null>(null);
	const [primary_post, setPrimaryPost] = useState<ForumPost | null>(null);
	const [created, setCreated] = useState<string>("");
	const [updated, setUpdated] = useState<string>("");

	useEffect(() => {
		const c = new Date(props.forum_thread.created).toLocaleString();
		setCreated(c);

		const u = new Date(props.forum_thread.updated).toLocaleString();
		setUpdated(u);

		(async () => {
			const a = await getUserFromID(props.forum_thread.author);
			setAuthor(a);

			const p = await getForumPostFromID(props.forum_thread.primary_post);
			setPrimaryPost(p);
		})();
	}, []);

	return (
		<div className={style.thread_preview}>
			<h4>{props.forum_thread.title}</h4>
			{primary_post !== null && (
				<span style={{ opacity: "0.5" }}>
					{primary_post.content.slice(0, 50)}...
				</span>
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

export default ThreadPreview;
