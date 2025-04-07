"use client";

import { generalManagementPermissionCheck } from "@/api/permissions";
import { Usergroup } from "@/api/usergroups/models";
import { getUserUserGroupsFromID } from "@/api/users/api";
import { User } from "@/api/users/models";
import { useEffect, useState } from "react";
import style from "./header.module.scss";
import Link from "next/link";

type SupportHeaderProps = {
	change_view: (view: number) => void;
    personal_user: User;
};

const SupportHeader = (props: SupportHeaderProps) => {
	const [usergroups, setUsergroups] = useState<Usergroup[]>([]);

	useEffect(() => {
		(async () => {
			const us = await getUserUserGroupsFromID(props.personal_user.id);
			setUsergroups(us);
		})();
	}, [props.personal_user.id]);

	return (
		<header className={style.support_header}>
			<h1>Support</h1>
			<nav>
				<button onClick={() => props.change_view(0)}>
					Your Tickets
				</button>
				<Link href={"/support/ticket/new"}>New Ticket</Link>
				{generalManagementPermissionCheck(usergroups) && (
					<button onClick={() => props.change_view(1)}>
						Admin Tickets
					</button>
				)}
			</nav>
		</header>
	);
};

export default SupportHeader;
