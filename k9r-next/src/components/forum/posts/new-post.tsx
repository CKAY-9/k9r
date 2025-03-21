"use client";

import { BaseSyntheticEvent, useState } from "react";
import style from "./post.module.scss";
import MDEditor from "@uiw/react-md-editor";
import { ForumPost, ForumThread } from "@/api/forum/models";
import { createNewForumPost } from "@/api/forum/api";
import { User } from "@/api/users/models";
import { getCookie } from "@/utils/cookies";

type NewForumPostProps = {
    forum_thread: ForumThread;
    personal_user: User;
    on_new_post?: Function;
};

const NewForumPost = (props: NewForumPostProps) => {
    const [content, setContent] = useState<string>("");

    const create = async (e: BaseSyntheticEvent) => {
        e.preventDefault();
    
        const date = new Date();
        const new_post: ForumPost = {
            id: -1,
            author: props.personal_user.id,
            content: content,
            json_content: "",
            created: date.toISOString(),
            updated: date.toISOString(),
            likes: [],
            dislikes: [],
            thread: props.forum_thread.id
        }
        const response = await createNewForumPost(new_post, getCookie("token") || "");
        setContent("");

        if (props.on_new_post !== undefined) {
            props.on_new_post(response !== null ? response : new_post);
        }
    }

	return (
		<div className={style.forum_post}>
			<div className={style.content}>
                <h4>Reply to the thread: {props.forum_thread.title}</h4>
				<MDEditor
					height="25rem"
					style={{
						width: "100%",
						fontSize: "1rem !important",
					}}
					value={content}
					onChange={(value: string | undefined) =>
						setContent(value || "")
					}
				/>
                <button onClick={create}>Create Post</button>
			</div>
		</div>
	);
};

export default NewForumPost;
