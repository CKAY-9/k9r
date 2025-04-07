"use client";

import { User } from "@/api/users/models";
import style from "./support.module.scss";
import { useEffect, useState } from "react";
import { SupportTicket } from "@/api/support/models";
import { getAllSupportTickets, getMySupportTickets } from "@/api/support/api";
import { getAnyToken } from "@/utils/token";
import SupportHeader from "@/components/support/support-header/support-header";
import NewSupportTicket from "@/components/support/new-ticket/new-ticket";
import { CommunityDetails } from "@/api/community-details/models";
import LoadingAlert from "@/components/loading/loading-alert";
import Link from "next/link";
import SupportTicketPreview from "@/components/support/ticket-preview/ticket-preview";

type SupportClientProps = {
	personal_user: User;
	community_details: CommunityDetails;
};

type MySupportProps = {
	personal_user: User;
};

type AdminSupportProps = {
	personal_user: User;
};

const MySupport = (props: MySupportProps) => {
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
				<LoadingAlert message="Loading tickets..." />
			) : (
				<div className={style.ticket_list}>
					{tickets.length <= 0 ? (
						<>
							<span>You have no existing tickets</span>
						</>
					) : (
						<>
							{tickets.map((ticket, index) => {
								return (
									<Link
										className={style.ticket_link}
										href={`/support/ticket/${ticket.id}`}
										key={index}
									>
										<SupportTicketPreview
											support_ticket={ticket}
											personal_user={props.personal_user}
										/>
									</Link>
								);
							})}
						</>
					)}
				</div>
			)}
		</>
	);
};

const AdminTickets = (props: AdminSupportProps) => {
	const [all_tickets, setAllTickets] = useState<SupportTicket[]>([]);
	const [loading, setLoading] = useState<boolean>(true);

	useEffect(() => {
		(async () => {
			const tickets = await getAllSupportTickets(await getAnyToken());
			setAllTickets(
				tickets
					.reverse()
					.sort((a, b) => {
						switch (a.status) {
							case 0:
								return b.status >= 0 ? 1 : -1;
							case 1:
								return -1;
							case 2:
								return 1;
						}

						return -1;
					})
			);
			setLoading(false);
		})();
	}, []);

	return (
		<>
			<h2>Admin Tickets</h2>
			<span>Respond to support tickets.</span>
			{loading ? (
				<LoadingAlert message="Loading tickets..." />
			) : (
				<>
					{all_tickets.map((ticket, index) => {
						return (
							<Link
								className={style.ticket_link}
								href={`/support/ticket/${ticket.id}`}
								key={index}
							>
								<SupportTicketPreview
									support_ticket={ticket}
									personal_user={props.personal_user}
								/>
							</Link>
						);
					})}
				</>
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
				community_details={props.community_details}
			/>
			<div
				className={style.support_section}
				style={{ display: view === 0 ? "flex" : "none" }}
			>
				<MySupport personal_user={props.personal_user} />
			</div>
			<div
				className={style.support_section}
				style={{ display: view === 1 ? "flex" : "none" }}
			>
				<NewSupportTicket personal_user={props.personal_user} />
			</div>
			<div
				className={style.support_section}
				style={{ display: view === 2 ? "flex" : "none" }}
			>
				<AdminTickets personal_user={props.personal_user} />
			</div>
		</>
	);
};

export default SupportClient;
