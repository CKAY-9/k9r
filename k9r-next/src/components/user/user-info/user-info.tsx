"use client";

import { User } from "@/api/users/models";
import style from "./info.module.scss";
import UserIcon from "../user-icon/user-icon";
import { useEffect, useState } from "react";
import { Usergroup } from "@/api/usergroups/models";
import { getUserUserGroupsFromID } from "@/api/users/api";
import Image from "next/image";

type UserInfoProps = {
	user: User;
};

const UserInfo = (props: UserInfoProps) => {
	const [usergroups, setUsergroups] = useState<Usergroup[]>([]);

	useEffect(() => {
		(async () => {
			const us = await getUserUserGroupsFromID(props.user.id);
			setUsergroups(us);
		})();
	}, []);

	return (
		<div className={style.user_info}>
			<section className={style.display}>
				<UserIcon size_rems={10} user={props.user} />
				<h2 className={style.display_name}>
					{props.user.display_name}
				</h2>
				<span className={style.username}>({props.user.username})</span>
				<p className={style.description}>{props.user.description}</p>
			</section>
			<section className={style.usergroups}>
				{usergroups.map((usergroup, index) => {
					return (
						<div key={index}>
                            {usergroup.icon !== "" && (
                                <Image 
                                    src={usergroup.icon}
                                    alt="Usergroup Icon"
                                    sizes="100%"
                                    width={0}
                                    height={0}
                                />
                            )}
                            <span style={{color: usergroup.color}}>{usergroup.name}</span>
                        </div>
					);
				})}
			</section>
		</div>
	);
};

export default UserInfo;
