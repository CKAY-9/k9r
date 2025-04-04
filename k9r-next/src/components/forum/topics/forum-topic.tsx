"use client";

import { ForumThread, ForumTopic } from "@/api/forum/models";
import { User } from "@/api/users/models";
import style from "./topics.module.scss";
import MaterialIcon from "@/components/material-icon/material-icon";
import Link from "next/link";
import { useEffect, useState } from "react";
import { getForumThreadsInForumTopicFromID, getLatestForumThreadInForumTopic } from "@/api/forum/api";
import LoadingAlert from "@/components/loading/loading-alert";
import ThreadPreview from "../threads/thread-preview";
import NavigateBack from "@/components/nav-back/nav-back";

type TopicProps = {
	personal_user: User | null;
	forum_topic: ForumTopic;
};

const Topic = (props: TopicProps) => {
	const [threads, setThreads] = useState<ForumThread[]>([]);
	const [loading_threads, setLoadingThreads] = useState<boolean>(true);
	
	useEffect(() => {
		(async () => {
			const ts = await getForumThreadsInForumTopicFromID(props.forum_topic.id);
			setThreads(ts);
			setLoadingThreads(false);
		})();
	}, [props.forum_topic]);

	return (
		<div className={style.topic_container}>
			<NavigateBack />
			<header className={style.header}>
				<section className={style.content}>
					<section>
						<h3 style={{ color: `${props.forum_topic.color}` }}>
							{props.forum_topic.name}
						</h3>
					</section>
					<span>{props.forum_topic.description}</span>
					<section className={style.stats}>
						<section className={style.stat}>
							<MaterialIcon
								alt="Threads"
								size_rems={2}
								src="/icons/thread.svg"
							/>
							<span>{threads.length}</span>
						</section>
						<section className={style.stat}>
							<MaterialIcon
								alt="Posts"
								size_rems={2}
								src="/icons/forum.svg"
							/>
							<span>0</span>
						</section>
					</section>
				</section>
				<section className={style.content}>
					<Link className={style.option} href={`/forum/topic/${props.forum_topic.id}/new`}>
						<MaterialIcon src="/icons/add.svg" alt="New Topic Thread" size_rems={2} />
						<span>New Thread</span>
					</Link>
				</section>
			</header>
			<div className={style.threads}>
				{loading_threads ? (
					<LoadingAlert message="Loading threads..." />
				) : (
					<>
						{threads.sort((a, b) => b.sticky ? 1 : -1 ).map((thread, index) => {
							return (
								<Link href={`/forum/topic/${thread.topic}/${thread.id}`} key={index}>
									<ThreadPreview forum_thread={thread} />
								</Link>
							)
						})}
					</>
				)}
			</div>
		</div>
	);
};

export default Topic;
