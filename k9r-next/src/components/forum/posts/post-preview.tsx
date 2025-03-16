"use client";

import { ForumPost } from "@/api/forum/models";
import { getUserFromID } from "@/api/users/api";
import { User } from "@/api/users/models";
import { useEffect, useState } from "react";
import style from "./post.module.scss";
import UserTab from "@/components/user/user-tab/user-tab";

type PostPreviewProps = {
    forum_post: ForumPost;
};

const PostPreview = (props: PostPreviewProps) => {
    const [author, setAuthor] = useState<User | null>(null);

	useEffect(() => {
		(async () => {
			const a = await getUserFromID(props.forum_post.author);
			setAuthor(a);
		})();
	}, []);

	return (
		<div className={style.post_preview}>
			<span>{props.forum_post.content}</span>
			{author !== null && (
                <UserTab user={author} />
            )}
		</div>
	);
}

export default PostPreview;