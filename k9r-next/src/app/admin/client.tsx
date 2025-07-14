"use client";

import { Usergroup } from "@/api/usergroups/models";
import { User } from "@/api/users/models";
import AdminHeader, { View } from "@/components/admin/admin-header/admin-header";
import { useState } from "react";
import ForumManagementAdmin from "@/components/admin/forum-management/forum-management";
import CommunityDetailsAdmin from "@/components/admin/community-details/community-details";
import UsergroupsAdmin from "@/components/admin/usergroups/usergroups";
import { CommunityDetails } from "@/api/community-details/models";
import UsersAdmin from "@/components/admin/users/users";
import GameServersAdmin from "@/components/admin/game-servers/game-servers";
import NavigateBack from "@/components/nav-back/nav-back";

type AdminHomeClientProps = {
	personal_user: User;
	community_details: CommunityDetails;
	usergroups: Usergroup[];
};

const AdminHomeClient = (props: AdminHomeClientProps) => {
	const [view, setView] = useState<View>(View.FORUM);

	return (
		<>
			<div className={`flex col gap-1`}>
				<NavigateBack />
				<AdminHeader
					community_details={props.community_details}
					set_view={setView}
					personal_user={props.personal_user}
					usergroups={props.usergroups}
				/>
				<div style={{ display: view === View.FORUM ? "block" : "none" }}>
					<ForumManagementAdmin />
				</div>
				<div style={{ display: view === View.DETAILS ? "block" : "none" }}>
					<CommunityDetailsAdmin />
				</div>
				<div style={{ display: view === View.USERGROUPS ? "block" : "none" }}>
					<UsergroupsAdmin />
				</div>
				<div style={{ display: view === View.USERS ? "block" : "none" }}>
					<UsersAdmin />
				</div>
				<div style={{ display: view === View.GAME_SERVERS ? "block" : "none" }}>
					<GameServersAdmin />
				</div>
			</div>
		</>
	);
};

export default AdminHomeClient;
