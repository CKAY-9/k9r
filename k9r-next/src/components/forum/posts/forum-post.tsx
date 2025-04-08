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
import LikeDislike from "../like-dislike/like-dislike";
import { getAnyToken } from "@/utils/token";

type ForumPostProps = {
	forum_post: ForumPost;
	personal_user: User | null;
	on_post_delete?: any;
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
		setCreated(new Date(props.forum_post.created).toLocaleString("en-us"));
		setUpdated(new Date(props.forum_post.updated).toLocaleString("en-us"));

		(async () => {
			const a = await getUserFromID(props.forum_post.author);
			setAuthor(a);

			if (a !== null && props.personal_user !== null) {
				setIsAuthor(a.id === props.personal_user.id);
			}
		})();
	}, [
		props.forum_post.author,
		props.forum_post.created,
		props.forum_post.updated,
		props.personal_user,
	]);

	const toggleEdit = async (e: BaseSyntheticEvent) => {
		e.preventDefault();

		if (editing) {
			// Update content
			post.content = post_content_edit;
			post.updated = new Date().toISOString();

			const update = await updateForumPostFromID(
				props.forum_post.id,
				post,
				await getAnyToken()
			);
		}

		setEditing(!editing);
	};

	const deletePost = async (e: BaseSyntheticEvent) => {
		e.preventDefault();

		const delete_response = await deleteForumPostFromID(
			props.forum_post.id,
			await getAnyToken()
		);

		if (props.on_post_delete !== undefined) {
			props.on_post_delete(props.forum_post.id);
		}
	};

	return (
		<div className={`${style.forum_post} flex row gap-1`} id={`post-${props.forum_post.id}`}>
			{author !== null && (
				<UserInfo user={author} as_link={true} from_post={true} personal_user={props.personal_user} />
			)}
			<div className={`${style.content} flex col gap-1 flex-1`}>
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
							autoCapitalize="off"
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
				<div className={`${style.times} flex row gap-1 align`}>
					<span className={style.time}>Posted: {created}</span>
					{created !== updated && (
						<span className={style.time}>Updated: {updated}</span>
					)}
				</div>
				{is_author && (
					<section className={`${style.options} flex row align gap-1`}>
						<button onClick={toggleEdit} className={`${style.option} no-border`}>
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
