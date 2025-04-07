"use client";

import { CommunityDetails } from "@/api/community-details/models";
import { ForumPost, ForumThread, ForumTopic } from "@/api/forum/models";
import { User } from "@/api/users/models";
import style from "./threads.module.scss";
import UserTab from "@/components/user/user-tab/user-tab";
import { BaseSyntheticEvent, useEffect, useState } from "react";
import {
	getUserFromID,
	getUserUserGroupsFromID,
} from "@/api/users/api";
import Link from "next/link";
import {
	deleteForumThreadFromID,
	getForumPostFromID,
	getForumPostsFromForumThreadID,
	likeThread,
	toggleThreadLock,
	toggleThreadSticky,
	updateForumThreadFromID,
} from "@/api/forum/api";
import Post from "../posts/forum-post";
import NewForumPost from "../posts/new-post";
import MaterialIcon from "@/components/material-icon/material-icon";
import { Usergroup } from "@/api/usergroups/models";
import { MANAGE_POSTS, usergroupsPermissionFlagCheck } from "@/api/permissions";
import LikeDislike from "../like-dislike/like-dislike";
import NavigateBack from "@/components/nav-back/nav-back";
import { getAnyToken } from "@/utils/token";

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
	const [locked, setLocked] = useState<boolean>(props.thread.locked || false);
	const [sticky, setSticky] = useState<boolean>(props.thread.sticky || false);
	const [posts, setPosts] = useState<ForumPost[]>([]);
	const [primary_post, setPrimaryPost] = useState<ForumPost | null>(null);
	const [title, setTitle] = useState<string>(props.thread.title);
	const [editing, setEditing] = useState<boolean>(false);
	const [is_author, setIsAuthor] = useState<boolean>(false);
	const [created, setCreated] = useState<string>("");
	const [updated, setUpdated] = useState<string>("");
	const [personal_usergroups, setPersonalUsergroups] = useState<Usergroup[]>(
		[]
	);

	useEffect(() => {
		(async () => {
			const a = await getUserFromID(props.thread.author);
			setAuthor(a);

			if (a !== null) {
				setIsAuthor(a.id === (props.personal_user?.id || -1));
			}

			setCreated(new Date(props.thread.created).toLocaleString());
			setUpdated(new Date(props.thread.updated).toLocaleString());

			const p = await getForumPostFromID(props.thread.primary_post);
			setPrimaryPost(p);

			const ps = await getForumPostsFromForumThreadID(props.thread.id);
			if (p !== null) {
				setPosts(ps.filter((v, i) => v.id !== p.id));
			} else {
				setPosts(ps);
			}

			if (props.personal_user !== null) {
				const us = await getUserUserGroupsFromID(
					props.personal_user.id
				);
				setPersonalUsergroups(us);
			}
		})();
	}, [
		props.thread.id,
		props.personal_user,
		props.thread.author,
		props.thread.created,
		props.thread.updated,
		props.thread.primary_post,
	]);

	const onPostDelete = async (post_id: number) => {
		setPosts(posts.filter((post, index) => post.id !== post_id));
	};

	const deleteThread = async (e: BaseSyntheticEvent) => {
		e.preventDefault();

		const response = await deleteForumThreadFromID(
			props.thread.id,
			await getAnyToken()
		);
		if (response) {
			window.location.href = `/forum/topic/${props.thread.topic}`;
		}
	};

	const toggleEdit = async (e: BaseSyntheticEvent) => {
		e.preventDefault();

		if (editing) {
			// Save
			thread.title = title;
			thread.updated = new Date().toISOString();

			const update = await updateForumThreadFromID(
				props.thread.id,
				thread,
				await getAnyToken()
			);
			setThread(thread);
		}

		setEditing(!editing);
	};

	const toggleLocked = async (e: BaseSyntheticEvent) => {
		e.preventDefault();

		const response = await toggleThreadLock(
			props.thread.id,
			await getAnyToken()
		);
		setLocked(!locked);
	};

	const toggleSticky = async (e: BaseSyntheticEvent) => {
		e.preventDefault();

		const response = await toggleThreadSticky(
			props.thread.id,
			await getAnyToken()
		);
		setSticky(!sticky);
	};

	return (
		<>
			<NavigateBack />
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
						<span className={style.time}>Posted: {created}</span>
						{created !== updated && (
							<span className={style.time}>
								Updated: {updated}
							</span>
						)}
					</div>
				</section>
				<section className={style.options}>
					<LikeDislike
						target={props.thread}
						like_endpoint={likeThread}
						personal_user={props.personal_user}
					/>
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
					{usergroupsPermissionFlagCheck(
						personal_usergroups,
						MANAGE_POSTS
					) && (
						<>
							<button
								onClick={toggleLocked}
								className={style.option}
								style={{ opacity: locked ? "1" : "0.5" }}
							>
								<MaterialIcon
									src="/icons/lock.svg"
									alt="Lock Thread"
									size_rems={2}
								/>
							</button>
							<button
								onClick={toggleSticky}
								className={style.option}
								style={{ opacity: sticky ? "1" : "0.5" }}
							>
								<MaterialIcon
									src="/icons/pin.svg"
									alt="Sticky Thread"
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
