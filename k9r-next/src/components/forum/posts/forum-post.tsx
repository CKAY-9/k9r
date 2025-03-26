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
import {
	deleteForumPostFromID,
	likePost,
	updateForumPostFromID,
} from "@/api/forum/api";
import { getCookie } from "@/utils/cookies";
import LikeDislike from "../like-dislike/like-dislike";

type ForumPostProps = {
	forum_post: ForumPost;
	personal_user: User | null;
	on_post_delete?: Function;
};

const Post = (props: ForumPostProps) => {
	const [post, setPost] = useState<ForumPost>(props.forum_post);
	const [post_content_edit, setPostContentEdit] = useState<string>(
		props.forum_post.content || ""
	);
	const [created, setCreated] = useState<string>("");
	const [updated, setUpdated] = useState<string>("");
	const [author, setAuthor] = useState<User | null>(null);
	const [is_author, setIsAuthor] = useState<boolean>(false);
	const [editing, setEditing] = useState<boolean>(false);

	useEffect(() => {
		setCreated(new Date(props.forum_post.created).toLocaleString());
		setUpdated(new Date(props.forum_post.updated).toLocaleString());

		(async () => {
			const a = await getUserFromID(props.forum_post.author);
			setAuthor(a);

			if (a !== null && props.personal_user !== null) {
				setIsAuthor(a.id === props.personal_user.id);
			}
		})();
	}, [props.forum_post.author]);

	const toggleEdit = async (e: BaseSyntheticEvent) => {
		e.preventDefault();

		if (editing) {
			// Update content
			post.content = post_content_edit;
			post.updated = new Date().toISOString();

			const update = await updateForumPostFromID(
				props.forum_post.id,
				post,
				getCookie("token") || ""
			);
		}

		setEditing(!editing);
	};

	const deletePost = async (e: BaseSyntheticEvent) => {
		e.preventDefault();

		const delete_response = await deleteForumPostFromID(
			props.forum_post.id,
			getCookie("token") || ""
		);

		if (props.on_post_delete !== undefined) {
			props.on_post_delete(props.forum_post.id);
		}
	};


	return (
		<div className={style.forum_post} id={`post-${props.forum_post.id}`}>
			{author !== null && <UserInfo user={author} />}
			<div className={style.content}>
				{editing ? (
					<>
						<MDEditor
							height="25rem"
							style={{
								width: "100%",
								fontSize: "1rem !important",
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
				<LikeDislike 
					target={props.forum_post}
					like_endpoint={likePost}
					personal_user={props.personal_user}
				/>
				<div className={style.times}>
					<span className={style.time}>Posted: {created}</span>
					{created !== updated && (
						<span className={style.time}>Updated: {updated}</span>
					)}
				</div>
				{is_author && (
					<section className={style.options}>
						<button onClick={toggleEdit} className={style.option}>
							<MaterialIcon
								src={`/icons/edit.svg`}
								alt="Edit Post"
								size_rems={2}
							/>
						</button>
						{props.on_post_delete !== undefined && (
							<button
								onClick={deletePost}
								className={style.option}
							>
								<MaterialIcon
									src={`/icons/delete.svg`}
									alt="Delete Post"
									size_rems={2}
								/>
							</button>
						)}
					</section>
				)}
			</div>
		</div>
	);
};

export default Post;
