"use client";

import { CommunityDetails } from "@/api/community-details/models";
import style from "./index.module.scss";
import Link from "next/link";
import Footer from "@/components/footer/footer";
import Header from "@/components/header/header";
import CommunityIcon from "@/components/community-icon/community-icon";
import { User } from "@/api/users/models";
import { COMMUNITY_FEATURE, FORUM_FEATURE, STORE_FEATURE } from "@/api/resources";
import {
    MANAGE_COMMUNITY,
	MANAGE_FORUMS,
	MANAGE_STORE,
	usergroupsPermissionFlagCheck,
} from "@/api/permissions";
import { useEffect, useState } from "react";
import { Usergroup } from "@/api/usergroups/models";
import { getUserUserGroupsFromID } from "@/api/users/api";

type IndexClientProps = {
	community_details: CommunityDetails;
	personal_user: User | null;
};

const IndexClient = (props: IndexClientProps) => {
	const [usergroups, setUsergroups] = useState<Usergroup[]>([]);

	useEffect(() => {
		(async () => {
			if (!props.personal_user) {
				return;
			}

			const us = await getUserUserGroupsFromID(props.personal_user.id);
			setUsergroups(us);
		})();
	}, [props.personal_user]);

	return (
		<>
			<Header
				personal_user={props.personal_user}
				community_details={props.community_details}
			/>
			<div
				className={style.splash}
				style={{
					background: `url(${
						props.community_details.banner
							? props.community_details.banner
							: "/wikimedia_commons_backgorund.gif"
					})`,
				}}
			>
				<div className={`${style.content} flex col align justify gap-1`}>
					<CommunityIcon
						size_rems={15}
						community_details={props.community_details}
					/>
					<span>
						{props.community_details.description.slice(0, 100)}
						{props.community_details.description.length >= 100 &&
							`...`}
					</span>
					<nav className={`${style.nav} flex row gap-1`}>
						{(props.community_details.features[FORUM_FEATURE] ||
							usergroupsPermissionFlagCheck(
								usergroups,
								MANAGE_FORUMS
							)) && <Link href="/forum">Forum</Link>}
						{(props.community_details.features[STORE_FEATURE] ||
							usergroupsPermissionFlagCheck(
								usergroups,
								MANAGE_STORE
							)) && <Link href="/store">Store</Link>}
						{(props.community_details.features[COMMUNITY_FEATURE] ||
							usergroupsPermissionFlagCheck(
								usergroups,
								MANAGE_COMMUNITY
							)) && <Link href="/community">Community</Link>}
					</nav>
					{props.personal_user === null && (
						<Link className={style.get_started} href="/user/login">
							Get Started
						</Link>
					)}
				</div>
			</div>
			<main className="container">
				<section id="about">
					<h2>{`About ${props.community_details.name}`}</h2>
					<p>{`${props.community_details.description}`}</p>
				</section>
			</main>
			<Footer community_details={props.community_details} />
		</>
	);
};

export default IndexClient;
