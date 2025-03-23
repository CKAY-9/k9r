"use client";

import { Usergroup } from "@/api/usergroups/models";
import { User } from "@/api/users/models";
import AdminHeader from "@/components/admin/admin-header/admin-header";
import { useState } from "react";
import style from "./admin.module.scss";
import ForumManagementAdmin from "@/components/admin/forum-management/forum-management";
import CommunityDetailsAdmin from "@/components/admin/community-details/community-details";
import UsergroupsAdmin from "@/components/admin/usergroups/usergroups";
import { CommunityDetails } from "@/api/community-details/models";
import UsersAdmin from "@/components/admin/users/users";
import GameServersAdmin from "@/components/admin/game-servers/game-servers";

type AdminHomeClientProps = {
	personal_user: User;
	community_details: CommunityDetails;
	usergroups: Usergroup[];
};

const AdminHomeClient = (props: AdminHomeClientProps) => {
	const [view, setView] = useState<number>(0);

	return (
		<>
			<div className={style.container}>
				<AdminHeader
					community_details={props.community_details}
					set_view={setView}
					personal_user={props.personal_user}
					usergroups={props.usergroups}
				/>
				<div style={{ display: view === 0 ? "block" : "none" }}>
					<ForumManagementAdmin />
				</div>
				<div style={{ display: view === 1 ? "block" : "none" }}>
					<CommunityDetailsAdmin />
				</div>
				<div style={{ display: view === 2 ? "block" : "none" }}>
					<UsergroupsAdmin />
				</div>
				<div style={{ display: view === 3 ? "block" : "none" }}>
					<UsersAdmin />
				</div>
				<div style={{ display: view === 4 ? "block" : "none" }}>
					<GameServersAdmin />
				</div>
			</div>
		</>
	);
};

export default AdminHomeClient;
