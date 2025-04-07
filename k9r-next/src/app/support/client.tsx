"use client";

import { User } from "@/api/users/models";
import style from "./support.module.scss";
import { useEffect, useState } from "react";
import { SupportTicket } from "@/api/support/models";
import { getMySupportTickets } from "@/api/support/api";
import { getCookie } from "@/utils/cookies";
import { getAnyToken } from "@/utils/token";
import Link from "next/link";
import { generalManagementPermissionCheck } from "@/api/permissions";
import { Usergroup } from "@/api/usergroups/models";
import { getUserUserGroupsFromID } from "@/api/users/api";
import SupportHeader from "@/components/support/support-header/support-header";

type SupportClientProps = {
	personal_user: User;
};

const MySupport = (props: SupportClientProps) => {
	const [tickets, setTickets] = useState<SupportTicket[]>([]);
	const [loading, setLoading] = useState<boolean>(true);

	useEffect(() => {
		(async () => {
			const token = await getAnyToken();
			const ts = await getMySupportTickets(token);

			setTickets(ts);
			setLoading(false);
		})();
	}, [props.personal_user.id]);

	return (
		<>
			<h2>Your Tickets</h2>
			{loading ? (
				<span>Loading your tickets...</span>
			) : (
				<div className={style.ticket_list}>
					{tickets.length <= 0 ? (
						<>
							<span>You have no existing tickets</span>
							<Link
								style={{ width: "fit-content" }}
								href={"/support/ticket/new"}
							>
								Create new ticket
							</Link>
						</>
					) : (
						<></>
					)}
				</div>
			)}
		</>
	);
};

const SupportClient = (props: SupportClientProps) => {
	const [view, setView] = useState<number>(0);

	return (
		<>
			<SupportHeader
				personal_user={props.personal_user}
				change_view={setView}
			/>
			<div
				className={style.support_section}
				style={{ display: view === 0 ? "flex" : "none" }}
			>
				<MySupport personal_user={props.personal_user} />
			</div>
		</>
	);
};

export default SupportClient;
