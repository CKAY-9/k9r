"use client";

import { CommunityDetails } from "@/api/community-details/models";
import { ForumPost, ForumThread, ForumTopic } from "@/api/forum/models";
import { User } from "@/api/users/models";
import style from "./threads.module.scss";
import UserTab from "@/components/user/user-tab/user-tab";
import { BaseSyntheticEvent, useEffect, useState } from "react";
import { getUserFromID } from "@/api/users/api";
import Link from "next/link";
import {
	deleteForumThreadFromID,
	getForumPostFromID,
	getForumPostsFromForumThreadID,
	updateForumThreadFromID,
} from "@/api/forum/api";
import Post from "../posts/forum-post";
import NewForumPost from "../posts/new-post";
import MaterialIcon from "@/components/material-icon/material-icon";
import { getCookie } from "@/utils/cookies";

type ThreadProps = {
	community_details: CommunityDetails;
	personal_user: User | null;
	topic: ForumTopic;
	thread: ForumThread;
	posts?: ForumPost[];
};

const Thread = (props: ThreadProps) => {
	const [author, setAuthor] = useState<User | null>(null);
	const [thread, setThread] = useState<ForumThread>(props.thread);
	const [posts, setPosts] = useState<ForumPost[]>([]);
	const [primary_post, setPrimaryPost] = useState<ForumPost | null>(null);
	const [title, setTitle] = useState<string>(props.thread.title);
	const [editing, setEditing] = useState<boolean>(false);
	const [is_author, setIsAuthor] = useState<boolean>(false);

	useEffect(() => {
		(async () => {
			const a = await getUserFromID(props.thread.author);
			setAuthor(a);

			if (a !== null) {
				setIsAuthor(a.id === (props.personal_user?.id || -1));
			}

			const p = await getForumPostFromID(props.thread.primary_post);
			setPrimaryPost(p);

			const ps = await getForumPostsFromForumThreadID(props.thread.id);
			if (p !== null) {
				setPosts(ps.filter((v, i) => v.id !== p.id));
			} else {
				setPosts(ps);
			}
		})();
	}, []);

	const onPostDelete = async (post_id: number) => {
		setPosts(posts.filter((post, index) => post.id !== post_id));
	};

	const deleteThread = async (e: BaseSyntheticEvent) => {
		e.preventDefault();
		const response = await deleteForumThreadFromID(
			props.thread.id,
			getCookie("token") || ""
		);
		if (response) {
			window.location.href = `/forum/topic/${props.thread.topic}`;
		}
	};

	const toggleEdit = async (e: BaseSyntheticEvent) => {
		if (editing) {
			// Save
			thread.title = title;
			thread.updated = (new Date().toISOString());

			const update = await updateForumThreadFromID(props.thread.id, thread, getCookie("token") || "");
			setThread(thread);
		}

		setEditing(!editing);
	};

	return (
		<>
			<header className={style.header}>
				<section className={style.section}>
					<div className={style.section}>
						{editing ? (
							<>
								<input
									onChange={(e: BaseSyntheticEvent) => {
										setTitle(e.target.value);
									}}
									type="text"
									placeholder="Thread Title"
									defaultValue={title}
								/>
							</>
						) : (
							<h2>{title}</h2>
						)}
						{author !== null && (
							<Link
								href={`/user/${author.id}`}
								className={style.user_tab}
							>
								<UserTab user={author} />
							</Link>
						)}
					</div>
					<div className={style.times}>
						<span className={style.time}>
							Posted:{" "}
							{new Date(props.thread.created).toLocaleString()}
						</span>
						{new Date(thread.created).getTime() !==
							new Date(thread.updated).getTime() && (
							<span className={style.time}>
								Updated:{" "}
								{new Date(
									props.thread.updated
								).toLocaleString()}
							</span>
						)}
					</div>
				</section>
				<section className={style.options}>
					{is_author && (
						<>
							<button
								onClick={toggleEdit}
								className={style.option}
							>
								<MaterialIcon
									src="/icons/edit.svg"
									alt="Edit Thread"
									size_rems={2}
								/>
							</button>
							<button
								onClick={deleteThread}
								className={style.option}
							>
								<MaterialIcon
									src="/icons/delete.svg"
									alt="Delete Thread"
									size_rems={2}
								/>
							</button>
						</>
					)}
				</section>
			</header>
			<div className={style.posts}>
				{primary_post !== null && (
					<Post
						personal_user={props.personal_user}
						forum_post={primary_post}
					/>
				)}
				{posts.map((post, index) => {
					return (
						<Post
							personal_user={props.personal_user}
							forum_post={post}
							key={index}
							on_post_delete={onPostDelete}
						/>
					);
				})}
				{props.personal_user !== null && (
					<NewForumPost
						forum_thread={props.thread}
						personal_user={props.personal_user}
						on_new_post={(post: ForumPost) => {
							setPosts((old) => [...old, post]);
						}}
					/>
				)}
			</div>
		</>
	);
};

export default Thread;
