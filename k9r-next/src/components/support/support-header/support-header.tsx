"use client";

import { generalManagementPermissionCheck } from "@/api/permissions";
import { Usergroup } from "@/api/usergroups/models";
import { getUserUserGroupsFromID } from "@/api/users/api";
import { User } from "@/api/users/models";
import { BaseSyntheticEvent, useEffect, useState } from "react";
import style from "./header.module.scss";
import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { CommunityDetails } from "@/api/community-details/models";

type SupportHeaderProps = {
	change_view?: (view: number) => void;
	personal_user: User;
	community_details: CommunityDetails;
	redirect_on_tab?: boolean;
};

const SupportHeader = (props: SupportHeaderProps) => {
	const router = useRouter();
	const pathname = usePathname();
	const searchParams = useSearchParams();
	const tab = searchParams.get("tab");

	const [usergroups, setUsergroups] = useState<Usergroup[]>([]);

	const changeView = (view: number) => {
		if (props.redirect_on_tab) {
			switch (view) {
				case 0:
					window.location.href = `/support?tab=yourtickets`;
					break;
				case 1:
					window.location.href = `/support?tab=newticket`;
					break;
				case 2:
					window.location.href = `/support?tab=admintickets`;
					break;
			}
			
			return;
		}

		switch (view) {
			case 0:
				router.push(pathname + "?" + "tab=yourtickets");
				document.title = `Your Support Tickets - ${props.community_details.name}`;
				break;
			case 1:
				router.push(pathname + "?" + "tab=newticket");
				document.title = `New Support Ticket - ${props.community_details.name}`;
				break;
			case 2:
				router.push(pathname + "?" + "tab=admintickets");
				document.title = `Admin Support Tickets - ${props.community_details.name}`;
				break;
		}

		if (props.change_view) {
			props.change_view(view);
		}
	};

	useEffect(() => {
		switch (tab) {
			case "yourtickets":
				changeView(0);
				break;
			case "newticket":
				changeView(1);
				break;
			case "admintickets":
				changeView(2);
				break;
		}

		(async () => {
			const us = await getUserUserGroupsFromID(props.personal_user.id);
			setUsergroups(us);
		})();
	}, [
		props.personal_user.id,
		tab,
		pathname,
		props.community_details.name,
		router,
	]);

	return (
		<header className={`${style.support_header} flex col gap-1`}>
			<h1>Support</h1>
			<nav className={`flex row gap-1 wrap`}>
				<button onClick={() => changeView(0)}>Your Tickets</button>
				<button onClick={() => changeView(1)}>New Ticket</button>
				{generalManagementPermissionCheck(usergroups) && (
					<button onClick={() => changeView(2)}>Admin Tickets</button>
				)}
			</nav>
		</header>
	);
};

export default SupportHeader;
