"use client";

import { CommunityDetails } from "@/api/community-details/models";
import { ForumPost, ForumThread, ForumTopic } from "@/api/forum/models";
import { User } from "@/api/users/models";
import style from "./threads.module.scss";
import UserTab from "@/components/user/user-tab/user-tab";
import { useEffect, useState } from "react";
import { getUserFromID } from "@/api/users/api";
import Link from "next/link";
import {
	getForumPostFromID,
	getForumPostsFromForumThreadID,
} from "@/api/forum/api";
import Post from "../posts/forum-post";
import NewForumPost from "../posts/new-post";

type ThreadProps = {
	community_details: CommunityDetails;
	personal_user: User | null;
	topic: ForumTopic;
	thread: ForumThread;
	posts?: ForumPost[];
};

const Thread = (props: ThreadProps) => {
	const [author, setAuthor] = useState<User | null>(null);
	const [posts, setPosts] = useState<ForumPost[]>([]);
	const [primary_post, setPrimaryPost] = useState<ForumPost | null>(null);
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

	return (
		<>
			<header className={style.header}>
				<section className={style.section}>
					<div className={style.section}>
						<h2>{props.thread.title}</h2>
						{author !== null && (
							<Link
								href={`/user/${author.id}`}
								className={style.user_tab}
							>
								<UserTab user={author} />
							</Link>
						)}
					</div>
					<div className={style.section}>
						<span className={style.time}>
							Posted:{" "}
							{new Date(props.thread.created).toLocaleString()}
						</span>
						{new Date(props.thread.created).getTime() !==
							new Date(props.thread.updated).getTime() && (
							<span>
								Updated:{" "}
								{new Date(
									props.thread.updated
								).toLocaleString()}
							</span>
						)}
					</div>
				</section>
				<section className={style.section}></section>
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
