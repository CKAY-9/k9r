import { Usergroup } from "@/api/usergroups/models";
import { User } from "@/api/users/models";
import style from "./header.module.scss";
import {
	MANAGE_COMMUNITY,
	MANAGE_DETAILS,
	MANAGE_FORUMS,
	MANAGE_USERGROUPS,
	MANAGE_USERS,
	usergroupsPermissionFlagCheck,
} from "@/api/permissions";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useEffect } from "react";
import { CommunityDetails } from "@/api/community-details/models";

export enum View {
	FORUM,
	DETAILS,
	USERGROUPS,
	USERS,
	GAME_SERVERS,
}

type AdminHeaderProps = {
	community_details: CommunityDetails;
	personal_user: User;
	usergroups: Usergroup[];
	set_view: any;
};

const AdminHeader = (props: AdminHeaderProps) => {
	const router = useRouter();
	const pathname = usePathname();
	const searchParams = useSearchParams();
	const tab = searchParams.get("tab");

	const changeView = (view: View) => {
		switch (view) {
			case View.FORUM:
				router.push(pathname + "?" + "tab=forum");
				document.title = `Manage Forum - ${props.community_details.name}`;
				break;
			case View.DETAILS:
				router.push(pathname + "?" + "tab=details");
				document.title = `Manage Details - ${props.community_details.name}`;
				break;
			case View.USERGROUPS:
				router.push(pathname + "?" + "tab=usergroups");
				document.title = `Manage Usergroups - ${props.community_details.name}`;
				break;
			case View.USERS:
				router.push(pathname + "?" + "tab=users");
				document.title = `Manage Users - ${props.community_details.name}`;
				break;
			case View.GAME_SERVERS:
				router.push(pathname + "?" + "tab=servers");
				document.title = `Manage Game Servers - ${props.community_details.name}`;
				break;
		}
		props.set_view(view);
	}

	useEffect(() => {
		switch (tab) {
			case "forum":
				changeView(View.FORUM);
				break;
			case "details":
				changeView(View.DETAILS);
				break;
			case "usergroups":
				changeView(View.USERGROUPS);
				break;
			case "users":
				changeView(View.USERS);
				break;
			case "servers":
				changeView(View.GAME_SERVERS);
				break;
		}
	}, [tab, pathname, props.community_details.name, router]);

	return (
		<>
			<nav className={`${style.admin_header} flex row`}>
				{usergroupsPermissionFlagCheck(
					props.usergroups,
					MANAGE_FORUMS
				) && (
					<button
						className={`${style.link} no-border`}
						onClick={() => changeView(0)}
					>
						Manage Forum
					</button>
				)}
				{usergroupsPermissionFlagCheck(
					props.usergroups,
					MANAGE_DETAILS
				) && (
					<button
						className={`${style.link} no-border`}
						onClick={() => changeView(1)}
					>
						Manage Details
					</button>
				)}
				{usergroupsPermissionFlagCheck(
					props.usergroups,
					MANAGE_USERGROUPS
				) && (
					<button
						className={`${style.link} no-border`}
						onClick={() => changeView(2)}
					>
						Usergroups
					</button>
				)}
				{usergroupsPermissionFlagCheck(
					props.usergroups,
					MANAGE_USERS
				) && (
					<button
						className={`${style.link} no-border`}
						onClick={() => changeView(3)}
					>
						Users
					</button>
				)}
				{usergroupsPermissionFlagCheck(
					props.usergroups,
					MANAGE_COMMUNITY
				) && (
					<button
						className={`${style.link} no-border`}
						onClick={() => changeView(4)}
					>
						Game Servers
					</button>
				)}
			</nav>
		</>
	);
};

export default AdminHeader;
