"use client";

import { ForumPost, ForumThread } from "@/api/forum/models";
import style from "./threads.module.scss";
import { useEffect, useState } from "react";
import { User } from "@/api/users/models";
import { getUserFromID } from "@/api/users/api";
import UserTab from "@/components/user/user-tab/user-tab";
import { getForumPostFromID } from "@/api/forum/api";
import MaterialIcon from "@/components/material-icon/material-icon";

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
	}, [
		props.forum_thread.author,
		props.forum_thread.created,
		props.forum_thread.primary_post,
		props.forum_thread.updated,
	]);

	return (
		<div className={style.thread_preview}>
			<section className={style.section}>
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
			</section>
			<section className={style.section}>
				<div>
					{props.forum_thread.locked && (
						<MaterialIcon
							src="/icons/lock.svg"
							alt="Thread Locked"
							size_rems={2}
						/>
					)}
					{props.forum_thread.sticky && (
						<MaterialIcon
							src="/icons/pin.svg"
							alt="Sticky Thread"
							size_rems={2}
						/>
					)}
				</div>
			</section>
		</div>
	);
};

export default ThreadPreview;
