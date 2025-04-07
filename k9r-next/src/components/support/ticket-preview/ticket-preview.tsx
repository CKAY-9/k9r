import { SupportTicket } from "@/api/support/models";
import { User } from "@/api/users/models";
import style from "./preview.module.scss";
import UserTab from "@/components/user/user-tab/user-tab";
import { useEffect, useState } from "react";
import { getUserFromID } from "@/api/users/api";
import Link from "next/link";
import SupportTicketStatus from "../ticket-status/status";

type SupportTicketPreviewProps = {
	support_ticket: SupportTicket;
	personal_user: User;
};

const SupportTicketPreview = (props: SupportTicketPreviewProps) => {
	const [creator, setCreator] = useState<User | null>(null);

	useEffect(() => {
		(async () => {
			const creator_user = await getUserFromID(
				props.support_ticket.creator
			);
			setCreator(creator_user);
		})();
	}, [props.support_ticket.creator]);

	return (
		<div className={style.preview}>
			<section className={style.title}>
				<h3>{props.support_ticket.issue_title}</h3>
				<SupportTicketStatus
					support_ticket_status={props.support_ticket.status}
				/>
			</section>
			<span style={{ textTransform: "capitalize" }}>
				Topic: {props.support_ticket.issue_topic}
			</span>
			<span>{props.support_ticket.issue_description.slice(0, 100)}</span>
			{creator && (
				<Link className={style.user_link} href={`/user/${creator.id}`}>
					<UserTab user={creator} />
				</Link>
			)}
		</div>
	);
};

export default SupportTicketPreview;
