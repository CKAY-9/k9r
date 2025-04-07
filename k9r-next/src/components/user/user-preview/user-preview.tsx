import { User } from "@/api/users/models";
import UserIcon from "../user-icon/user-icon";
import style from "./preview.module.scss";

type UserPreviewProps = {
	user: User;
};

const UserPreview = (props: UserPreviewProps) => {
	return (
		<div className={`${style.user_preview} flex col gap-1`}>
			<section className={`${style.info} flex row gap-1 align`}>
				<UserIcon user={props.user} size_rems={5} />
				<h3>{props.user.display_name}</h3>
				<span style={{ opacity: "0.5" }}>({props.user.username})</span>
			</section>
			<span>{props.user.description}</span>
		</div>
	);
};

export default UserPreview;
