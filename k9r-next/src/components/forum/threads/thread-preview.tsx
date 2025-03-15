"use client";

import { ForumThread } from "@/api/forum/models";
import style from "./threads.module.scss";
import { useEffect, useState } from "react";
import { User } from "@/api/users/models";
import { getUserFromID } from "@/api/users/api";
import UserTab from "@/components/user/user-tab/user-tab";
import Link from "next/link";

type ThreadPreviewProps = {
	forum_thread: ForumThread;
};

const ThreadPreview = (props: ThreadPreviewProps) => {
	const [author, setAuthor] = useState<User | null>(null);

	useEffect(() => {
		(async () => {
			const a = await getUserFromID(props.forum_thread.author);
			setAuthor(a);
		})();
	}, []);

	return (
		<div className={style.thread_preview}>
			<h4>{props.forum_thread.title}</h4>
			{author !== null && (
                <UserTab user={author} />
            )}
		</div>
	);
};

export default ThreadPreview;
