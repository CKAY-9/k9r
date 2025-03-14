"use client";

import { Usergroup } from "@/api/usergroups/models";
import { User } from "@/api/users/models";
import AdminHeader from "@/components/admin/admin-header/admin-header";
import ForumManagement from "@/components/admin/forum-management/forum-management";
import { useState } from "react";
import style from "./admin.module.scss";

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
					<ForumManagement />
				</div>
				<div style={{ display: view === 0 ? "block" : "none" }}></div>
			</div>
		</>
	);
};

export default AdminHomeClient;
