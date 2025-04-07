"use client";

import { User } from "@/api/users/models";
import style from "./info.module.scss";
import UserIcon from "../user-icon/user-icon";
import { useEffect, useState } from "react";
import { Usergroup } from "@/api/usergroups/models";
import { getUserUserGroupsFromID } from "@/api/users/api";
import Image from "next/image";
import UserUsergroups from "../usergroups/user-usergroups";
import Link from "next/link";
import LogoutButton from "@/components/logout-button/logout";
import MaterialIcon from "@/components/material-icon/material-icon";

type UserInfoProps = {
	user: User;
	as_link?: boolean;
	from_post?: boolean;
	personal_user?: User | null;
};

const UserInfo = (props: UserInfoProps) => {
	return (
		<div className={`${style.user_info} flex col gap-1 align`}>
			<section className={`${style.display} flex col align`}>
				{props.as_link ? (
					<Link
						href={`/user/${props.user.id}`}
						className={style.as_link}
					>
						<UserIcon size_rems={10} user={props.user} />
						<h2 className={style.display_name}>
							{props.user.display_name}
						</h2>
						<span className={style.username}>
							({props.user.username})
						</span>
					</Link>
				) : (
					<>
						<UserIcon size_rems={10} user={props.user} />
						<h2 className={style.display_name}>
							{props.user.display_name}
						</h2>
						<span className={style.username}>
							({props.user.username})
						</span>
					</>
				)}
				{props.from_post ? (
					<></>
				) : (
					<p className={style.description}>
						{props.user.description}
					</p>
				)}
			</section>
			<UserUsergroups user_id={props.user.id} />
			{props.personal_user && (props.personal_user.id === props.user.id) && (
				<section className={`${style.user_settings} flex row wrap gap-1`}>
					<Link href={"/user/settings"}>
						<MaterialIcon src="/icons/settings.svg" size_rems={2} alt="Settings" />
					</Link>
					<LogoutButton button_type="icon" />
				</section>
			)}
		</div>
	);
};

export default UserInfo;
