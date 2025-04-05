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

type UserInfoProps = {
	user: User;
	as_link?: boolean;
	from_post?: boolean;
};

const UserInfo = (props: UserInfoProps) => {
	return (
		<div className={style.user_info}>
			<section className={style.display}>
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
		</div>
	);
};

export default UserInfo;
