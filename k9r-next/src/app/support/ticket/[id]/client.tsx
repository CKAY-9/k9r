"use client";

import { CommunityDetails } from "@/api/community-details/models";
import {
	createNewSupportTicketReply,
	getSupportTicketReplies,
} from "@/api/support/api";
import { SupportTicket, SupportTicketReply } from "@/api/support/models";
import { User } from "@/api/users/models";
import SupportHeader from "@/components/support/support-header/support-header";
import { getAnyToken } from "@/utils/token";
import { BaseSyntheticEvent, useEffect, useState } from "react";
import style from "./ticket.module.scss";
import NavigateBack from "@/components/nav-back/nav-back";
import UserTab from "@/components/user/user-tab/user-tab";
import { getUserFromID } from "@/api/users/api";
import SupportTicketStatus from "@/components/support/ticket-status/status";
import Link from "next/link";
import TicketReply from "@/components/support/reply/ticket-reply";
import FileUpload from "@/components/file-upload/file-upload";

type TicketClientProps = {
	personal_user: User;
	community_details: CommunityDetails;
	support_ticket: SupportTicket;
};

const SupportTicketClient = (props: TicketClientProps) => {
	const [replies, setReplies] = useState<SupportTicketReply[]>([]);
	const [creator, setCreator] = useState<User | null>(null);
	const [status, setStatus] = useState<number>(
		props.support_ticket.status || 0
	);
	const [new_message, setNewMessage] = useState<string>("");
	const [new_files, setNewFiles] = useState<string[]>([]);

	useEffect(() => {
		(async () => {
			const reps = await getSupportTicketReplies(
				props.support_ticket.id,
				await getAnyToken()
			);
			setReplies(reps);

			const cre = await getUserFromID(props.support_ticket.creator);
			setCreator(cre);
		})();
	}, [props.support_ticket.id, props.support_ticket.creator]);

	const replyToTicket = async (e: BaseSyntheticEvent) => {
		e.preventDefault();

		const new_ticket = {
			id: -1,
			created: new Date().toISOString(),
			support_ticket: props.support_ticket.id,
			file_attachments: new_files,
			message: new_message,
			user_id: props.personal_user.id,
		};

		const response = await createNewSupportTicketReply(
			props.support_ticket.id,
			new_ticket,
			await getAnyToken()
		);

		if (status === 0) {
			setStatus(1);
		}
		setReplies((old) => [...old, new_ticket]);
	};

	return (
		<>
			<SupportHeader
				community_details={props.community_details}
				redirect_on_tab={true}
				personal_user={props.personal_user}
			/>
			<div className={style.ticket_container}>
				<NavigateBack />
				<section className={`flex row align gap-2`}>
					<h2>{props.support_ticket.issue_title}</h2>
					<SupportTicketStatus support_ticket_status={status} />
				</section>
				{creator && (
					<Link
						href={`/user/${creator.id}`}
						style={{ borderBottom: "none" }}
					>
						<UserTab user={creator} />
					</Link>
				)}
				<section>
					<h4>Topic</h4>
					<span style={{ textTransform: "capitalize" }}>
						{props.support_ticket.issue_topic}
					</span>
					{props.support_ticket.issue_topic === "users" && (
						<span>Involved user(s): </span>
					)}
				</section>
				<section>
					<h4>Description</h4>
					<p>{props.support_ticket.issue_description}</p>
				</section>
				<section className={style.replies_container}>
					<h3>Replies</h3>
					<div className={style.replies}>
						{replies.map((reply, index) => {
							return (
								<TicketReply
									support_ticket_reply={reply}
									key={index}
								/>
							);
						})}
					</div>
					<div className={style.new_reply}>
						<textarea
							onChange={(e: BaseSyntheticEvent) =>
								setNewMessage(e.target.value)
							}
							rows={5}
							minLength={10}
						></textarea>
						<section>
							<label>Attach Files</label>
							<FileUpload />
						</section>
						<button onClick={replyToTicket}>
							Reply as {props.personal_user.username}
						</button>
					</div>
				</section>
			</div>
		</>
	);
};

export default SupportTicketClient;
