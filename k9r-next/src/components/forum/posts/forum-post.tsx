"use client";

import { ForumPost } from "@/api/forum/models";
import style from "./post.module.scss";
import MarkdownPreview from "@uiw/react-markdown-preview";
import { BaseSyntheticEvent, useEffect, useState } from "react";
import UserInfo from "@/components/user/user-info/user-info";
import { User } from "@/api/users/models";
import { getUserFromID } from "@/api/users/api";
import MaterialIcon from "@/components/material-icon/material-icon";
import MDEditor from "@uiw/react-md-editor";

type ForumPostProps = {
	forum_post: ForumPost;
	personal_user: User | null;
};

const Post = (props: ForumPostProps) => {
	const [post, setPost] = useState<ForumPost>(props.forum_post);
    const [post_content_edit, setPostContentEdit] = useState<string>(props.forum_post.content || "");
	const [author, setAuthor] = useState<User | null>(null);
	const [is_author, setIsAuthor] = useState<boolean>(false);
	const [editing, setEditing] = useState<boolean>(false);

	useEffect(() => {
		(async () => {
			const a = await getUserFromID(props.forum_post.author);
			setAuthor(a);

			if (a !== null && props.personal_user !== null) {
				setIsAuthor(a.id === props.personal_user.id);
			}
		})();
	}, [props.forum_post.author]);

	const toggleEdit = (e: BaseSyntheticEvent) => {
		e.preventDefault();

        if (editing) {
            // Update content            
        }

		setEditing(!editing);
	};

	return (
		<div className={style.forum_post}>
			{author !== null && <UserInfo user={author} />}
			<div className={style.content}>
				{editing ? (
					<>
						<MDEditor
							height="25rem"
							style={{
								width: "100%",
								fontSize: "1rem !important"
							}}
							value={post_content_edit}
							onChange={(value: string | undefined) =>
								setPostContentEdit(value || "")
							}
						/>
					</>
				) : (
					<MarkdownPreview
						style={{ backgroundColor: "transparent", flex: "1" }}
						source={post.content || ""}
					/>
				)}
				<section>
					<span className={style.time}>
						Posted:{" "}
						{new Date(props.forum_post.created).toLocaleString()}
					</span>
					{new Date(props.forum_post.created).getTime() !==
						new Date(props.forum_post.updated).getTime() && (
						<span>
							Updated:{" "}
							{new Date(
								props.forum_post.updated
							).toLocaleString()}
						</span>
					)}
				</section>
				{is_author && (
					<section>
						<button onClick={toggleEdit} className={style.option}>
							<MaterialIcon
								src={`/icons/edit.svg`}
								size_rems={2}
							/>
						</button>
					</section>
				)}
			</div>
		</div>
	);
};

export default Post;
