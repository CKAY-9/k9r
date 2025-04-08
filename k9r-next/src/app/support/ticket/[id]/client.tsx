"use client";

import { CommunityDetails } from "@/api/community-details/models";
import {
	createNewSupportTicketReply,
	getSupportTicketReplies,
	toggleSupportTicketCompleted,
} from "@/api/support/api";
import { SupportTicket, SupportTicketReply } from "@/api/support/models";
import { User } from "@/api/users/models";
import SupportHeader from "@/components/support/support-header/support-header";
import { getAnyToken } from "@/utils/token";
import { BaseSyntheticEvent, useEffect, useState } from "react";
import style from "./ticket.module.scss";
import NavigateBack from "@/components/nav-back/nav-back";
import UserTab from "@/components/user/user-tab/user-tab";
import { getUserFromID, getUserUserGroupsFromID } from "@/api/users/api";
import SupportTicketStatus from "@/components/support/ticket-status/status";
import Link from "next/link";
import TicketReply from "@/components/support/reply/ticket-reply";
import FileUpload from "@/components/file-upload/file-upload";
import { generalManagementPermissionCheck } from "@/api/permissions";
import { Usergroup } from "@/api/usergroups/models";

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
	const [usergroups, setUsergroups] = useState<Usergroup[]>([]);
	const [involved_users, setInvolvedUsers] = useState<User[]>([]);

	useEffect(() => {
		(async () => {
			const reps = await getSupportTicketReplies(
				props.support_ticket.id,
				await getAnyToken()
			);
			setReplies(reps);

			const cre = await getUserFromID(props.support_ticket.creator);
			setCreator(cre);

			const us = await getUserUserGroupsFromID(props.personal_user.id);
			setUsergroups(us);

			if (props.support_ticket.issue_topic === "users") {
				const user_promises = props.support_ticket.involved_users.map((id) => getUserFromID(id));
				const users = await Promise.all(user_promises);
				const valid_users = users.filter((user) => user !== null);
				setInvolvedUsers(valid_users);
			}
		})();
	}, [props.support_ticket.id, props.support_ticket.creator]);

	const replyToTicket = async (e: BaseSyntheticEvent) => {
		e.preventDefault();

		if (status == 2 && !generalManagementPermissionCheck(usergroups)) {
			return;
		}

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

	const toggleTicketClose = async (e: BaseSyntheticEvent) => {
		e.preventDefault();

		const response = await toggleSupportTicketCompleted(
			props.support_ticket.id,
			await getAnyToken()
		);
		setStatus(status < 2 ? 2 : 1);
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
				<section className="flex col gap-half">
					<h4>Topic</h4>
					<span style={{ textTransform: "capitalize" }}>
						{props.support_ticket.issue_topic}
					</span>
					{props.support_ticket.issue_topic === "users" && (
						<div className="flex row align gap-1 wrap">
							{involved_users.map((user, index) => {
								return (
									<Link style={{"border": "none"}} href={`/user/${user.id}`} key={index}>
										<UserTab user={user} />
									</Link>
								)
							})}
						</div>
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
							placeholder="New Reply"
							minLength={10}
						></textarea>
						<section>
							<label>Attach Files</label>
							<FileUpload />
						</section>
						<div className="flex gap-1 align">
							<button
								onClick={replyToTicket}
								style={{ width: "fit-content" }}
							>
								Reply as {props.personal_user.username}
							</button>
							{generalManagementPermissionCheck(usergroups) && (
								<button onClick={toggleTicketClose}>
									Close Ticket
								</button>
							)}
						</div>
					</div>
				</section>
			</div>
		</>
	);
};

export default SupportTicketClient;
