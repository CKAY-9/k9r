"use client";

import { ForumPost, ForumThread } from "@/api/forum/models";
import { User } from "@/api/users/models";
import { getCookie } from "@/utils/cookies";
import style from "./like-dislike.module.scss";
import { useEffect, useState } from "react";
import MaterialIcon from "@/components/material-icon/material-icon";

type LikeDislikeProps = {
	target: ForumPost | ForumThread;
	like_endpoint: Function;
	personal_user: User | null;
	on_like?: Function;
	on_dislike?: Function;
	on_neutral?: Function;
};

const LikeDislike = (props: LikeDislikeProps) => {
	const [likes, setLikes] = useState<number[]>(props.target.likes);
	const [dislikes, setDislikes] = useState<number[]>(props.target.dislikes);
	const [like_state, setLikeState] = useState<-1 | 0 | 1>(0);

	useEffect(() => {
		if (likes.includes(props.personal_user?.id || 0)) {
			setLikeState(1);
		}

		if (dislikes.includes(props.personal_user?.id || 0)) {
			setLikeState(-1);
		}
	});

	const like = async (state: -1 | 0 | 1) => {
		if (props.personal_user === null) {
			return;
		}

		if (likes.includes(props.personal_user.id)) {
			likes.splice(likes.indexOf(props.personal_user.id));
		}

		if (dislikes.includes(props.personal_user.id)) {
			dislikes.splice(dislikes.indexOf(props.personal_user.id));
		}

		if (state === like_state) {
			const response = await props.like_endpoint(
				0,
				props.target.id,
				getCookie("token") || ""
			);
			setLikeState(0);
			return;
		}

		const response = await props.like_endpoint(
			state,
			props.target.id,
			getCookie("token") || ""
		);

		setLikeState(state);
		if (state === -1) {
			dislikes.push(props.personal_user.id);
			setDislikes(dislikes);
		} else {
			likes.push(props.personal_user.id);
			setLikes(likes);
		}
	};

	return (
		<div className={style.likes} style={{"opacity": props.personal_user === null ? "0.5" : "1", "pointerEvents": props.personal_user === null ? "none" : "initial"}}>
			<button
				className={style.like}
				style={{
					opacity: likes.includes(props.personal_user?.id || -1)
						? "1"
						: "0.5",
				}}
				onClick={() => like(1)}
			>
				<MaterialIcon
					src="/icons/thumbs_up.svg"
					alt="Like post"
					size_rems={2}
				/>
			</button>
			<span>{likes.length - dislikes.length}</span>
			<button
				className={style.like}
				style={{
					opacity: dislikes.includes(props.personal_user?.id || -1)
						? "1"
						: "0.5",
				}}
				onClick={() => like(-1)}
			>
				<MaterialIcon
					src="/icons/thumbs_down.svg"
					alt="Like post"
					size_rems={2}
				/>
			</button>
		</div>
	);
};

export default LikeDislike;
