"use client";

import { Usergroup } from "@/api/usergroups/models";
import { User } from "@/api/users/models";
import AdminHeader from "@/components/admin/admin-header/admin-header";
import { useState } from "react";
import style from "./admin.module.scss";
import ForumManagementAdmin from "@/components/admin/forum-management/forum-management";
import CommunityDetailsAdmin from "@/components/admin/community-details/community-details";

type AdminHomeClientProps = {
	personal_user: User;
	usergroups: Usergroup[];
};

const AdminHomeClient = (props: AdminHomeClientProps) => {
	const [view, setView] = useState<number>(0);

	return (
		<>
			<div className={style.container}>
				<AdminHeader
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
			</div>
		</>
	);
};

export default AdminHomeClient;
