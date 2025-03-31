"use client";

import { ForumThread, ForumTopic } from "@/api/forum/models";
import style from "./topics.module.scss";
import MaterialIcon from "@/components/material-icon/material-icon";
import { useEffect, useState } from "react";
import {
	getForumThreadsInForumTopicFromID,
	getLatestForumThreadInForumTopic,
} from "@/api/forum/api";
import { User } from "@/api/users/models";
import { getUserFromID } from "@/api/users/api";
import UserIcon from "@/components/user/user-icon/user-icon";
import UserTab from "@/components/user/user-tab/user-tab";
import { calcTimeSinceMillis } from "@/utils/time-ago";

type TopicPreviewProps = {
	forum_topic: ForumTopic;
};

const TopicPreview = (props: TopicPreviewProps) => {
	const [threads, setThreads] = useState<ForumThread[]>([]);
	const [latest_thread, setLatestThread] = useState<ForumThread | null>(null);
	const [latest_thread_author, setLatestThreadAuthor] = useState<User | null>(
		null
	);

	useEffect(() => {
		(async () => {
			const ts = await getForumThreadsInForumTopicFromID(
				props.forum_topic.id
			);
			setThreads(ts);

			const lt = await getLatestForumThreadInForumTopic(
				props.forum_topic.id
			);
			setLatestThread(lt);

			if (lt !== null) {
				const lta = await getUserFromID(lt.author);
				setLatestThreadAuthor(lta);
			}
		})();
	}, [props.forum_topic.id]);

	return (
		<div className={style.topic_preview}>
			<div className={style.info}>
				{props.forum_topic.icon.length >= 1 && (
					<MaterialIcon
						src={props.forum_topic.icon}
						alt="Topic Icon"
						size_rems={2}
					/>
				)}
				<h4 style={{ color: `${props.forum_topic.color}` }}>
					{props.forum_topic.name}
				</h4>
				<span>{props.forum_topic.description}</span>
			</div>
			{latest_thread !== null && (
				<section className={style.latest_thread}>
					{latest_thread_author !== null && (
						<UserTab user={latest_thread_author} />
					)}
					<span>{latest_thread.title}</span>
					<span style={{ opacity: "0.5" }}>
						{" "}
						{calcTimeSinceMillis(
							new Date(latest_thread.created).getTime(),
							new Date().getTime()
						)}{" "}
						ago
					</span>
				</section>
			)}
			<div className={style.info} style={{ gap: "0.5rem" }}>
				<MaterialIcon
					size_rems={2}
					alt="Thread Count"
					src="/icons/thread.svg"
				/>
				<span>{threads.length}</span>
			</div>
		</div>
	);
};

export default TopicPreview;
