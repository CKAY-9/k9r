"use client"

import { Usergroup } from "@/api/usergroups/models";
import { getUserUserGroupsFromID } from "@/api/users/api";
import Image from "next/image";
import { useEffect, useState } from "react";

type UserUsergroupsProps = {
    user_id: number
};

const UserUsergroups = (props: UserUsergroupsProps) => {
	const [usergroups, setUsergroups] = useState<Usergroup[]>([]);

	useEffect(() => {
		(async () => {
			const us = await getUserUserGroupsFromID(props.user_id);
			setUsergroups(us);
		})();
	}, [props.user_id]);

	return (
		<>
			<section className={`flex row wrap gap-1`}>
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
							<span style={{ color: usergroup.color }}>
								{usergroup.name}
							</span>
						</div>
					);
				})}
			</section>
		</>
	);
};

export default UserUsergroups;
