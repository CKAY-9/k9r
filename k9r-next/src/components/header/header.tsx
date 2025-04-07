"use client";

import { CommunityDetails } from "@/api/community-details/models";
import style from "./header.module.scss";
import Link from "next/link";
import CommunityIcon from "../community-icon/community-icon";
import { User } from "@/api/users/models";
import UserIcon from "../user/user-icon/user-icon";
import { useEffect, useState } from "react";
import { Usergroup } from "@/api/usergroups/models";
import { getUserUserGroupsFromID } from "@/api/users/api";
import {
	MANAGE_COMMUNITY,
	MANAGE_FORUMS,
	MANAGE_STORE,
	SITE_SETTINGS,
	usergroupsPermissionFlagCheck,
} from "@/api/permissions";
import MaterialIcon from "../material-icon/material-icon";
import UserTab from "../user/user-tab/user-tab";
import {
	COMMUNITY_FEATURE,
	FORUM_FEATURE,
	STORE_FEATURE,
} from "@/api/resources";
import LogoutButton from "../logout-button/logout";

type HeaderProps = {
	community_details: CommunityDetails;
	personal_user: User | null;
};

const Header = (props: HeaderProps) => {
	const [usergroups, setUsergroups] = useState<Usergroup[]>([]);

	useEffect(() => {
		(async () => {
			if (props.personal_user === null) {
				return;
			}

			const groups = await getUserUserGroupsFromID(
				props.personal_user.id
			);
			setUsergroups(groups);
		})();
	}, [props.personal_user]);

	return (
		<header className={`${style.header} flex row`}>
			<nav className={`flex align justify gap-2`}>
				<Link href={"/"}>
					<CommunityIcon
						community_details={props.community_details}
						size_rems={3}
					/>
				</Link>
				{(props.community_details.features[FORUM_FEATURE] ||
					usergroupsPermissionFlagCheck(
						usergroups,
						MANAGE_FORUMS
					)) && (
					<Link href={"/forum"}>
						<span>{"Forum"}</span>
					</Link>
				)}
				{(props.community_details.features[STORE_FEATURE] ||
					usergroupsPermissionFlagCheck(
						usergroups,
						MANAGE_STORE
					)) && (
					<Link href={"/store"}>
						<span>{"Store"}</span>
					</Link>
				)}
				{(props.community_details.features[COMMUNITY_FEATURE] ||
					usergroupsPermissionFlagCheck(
						usergroups,
						MANAGE_COMMUNITY
					)) && (
					<Link href={"/community"}>
						<span>{"Community"}</span>
					</Link>
				)}
				<Link href={"/support"}>
					<span>{"Support"}</span>
				</Link>
			</nav>
			<nav className={`flex align justify gap-1`}>
				{props.personal_user !== null ? (
					<>
						{usergroups.length >= 1 &&
							usergroupsPermissionFlagCheck(
								usergroups,
								SITE_SETTINGS
							) && (
								<Link href={`/admin`}>
									<MaterialIcon
										src="/icons/admin_settings.svg"
										alt="Admin Settings"
										size_rems={2}
									/>
								</Link>
							)}
						<Link href={`/user/settings`}>
							<MaterialIcon
								src="/icons/settings.svg"
								alt="User Settings"
								size_rems={2}
							/>
						</Link>
						<LogoutButton button_type="icon" />
						<Link
							href={`/user/${props.personal_user.id}`}
						>
							<UserTab user={props.personal_user} />
						</Link>
					</>
				) : (
					<>
						<Link href="/user/login">
							<span>{"Login/Register"}</span>
						</Link>
					</>
				)}
			</nav>
		</header>
	);
};

export default Header;
