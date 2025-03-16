"use client";

import { BaseSyntheticEvent, useEffect, useState } from "react";
import style from "./activity.module.scss";
import { User } from "@/api/users/models";
import { ForumPost, ForumThread, ForumTopic } from "@/api/forum/models";
import { getPostsPostedByUser, getThreadsPostedByUser } from "@/api/users/api";
import ThreadPreview from "@/components/forum/threads/thread-preview";
import Link from "next/link";
import PostPreview from "@/components/forum/posts/post-preview";
import { getForumThreadFromID, getForumTopicFromID } from "@/api/forum/api";

type UserActivityProps = {
	user: User;
};

type PostProps = {
    post: ForumPost;
};

const Post = (props: PostProps) => {
    const [topic, setTopic] = useState<ForumTopic | null>(null);
    const [thread, setThread] = useState<ForumThread | null>(null);

    useEffect(() => {
        (async () => {
            const th = await getForumThreadFromID(props.post.thread);
            setThread(th);

            if (th !== null) {
                const to = await getForumTopicFromID(th.topic);
                setTopic(to);
            }
        })();
    }, []);


	return (
		<>
			<Link
				className={style.preview}
				href={(thread !== null && topic !== null) ? `/forum/topic/${topic.id}/${thread.id}#post-${props.post.id}` : "/forum"}
			>
				<PostPreview forum_post={props.post} />
			</Link>
		</>
	);
};

const UserActivity = (props: UserActivityProps) => {
	const [view, setView] = useState<number>(0);
	const [threads, setThreads] = useState<ForumThread[]>([]);
	const [posts, setPosts] = useState<ForumPost[]>([]);

	useEffect(() => {
		(async () => {
			const ts = await getThreadsPostedByUser(props.user.id);
			setThreads(ts);

			const ps = await getPostsPostedByUser(props.user.id);
			setPosts(ps);
		})();
	}, []);

	const changeView = (e: BaseSyntheticEvent, new_view: number) => {
		e.preventDefault();

		setView(new_view);
	};

	return (
		<div className={style.activity_container}>
			<nav>
				<button onClick={(e: BaseSyntheticEvent) => changeView(e, 0)}>
					Threads ({threads.length})
				</button>
				<button onClick={(e: BaseSyntheticEvent) => changeView(e, 1)}>
					Posts ({posts.length})
				</button>
			</nav>
			<div>
				<div
					style={{ display: view === 0 ? "flex" : "none" }}
					className={style.list}
				>
					<h4>Threads</h4>
					{threads.map((thread, index) => {
						return (
							<Link
								className={style.preview}
								href={`/forum/topic/${thread.topic}/${thread.id}`}
								key={index}
							>
								<ThreadPreview forum_thread={thread} />
							</Link>
						);
					})}
				</div>
				<div
					style={{ display: view === 1 ? "flex" : "none" }}
					className={style.list}
				>
					<h4>Posts</h4>
					{posts.map((post, index) => {
						return <Post post={post} key={index} />;
					})}
				</div>
			</div>
		</div>
	);
};

export default UserActivity;
