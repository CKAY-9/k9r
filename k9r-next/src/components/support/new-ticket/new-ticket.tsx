"use client";

import { User } from "@/api/users/models";
import style from "./new.module.scss";
import { BaseSyntheticEvent, useState } from "react";
import { SupportTicket } from "@/api/support/models";
import { createNewSupportTicket } from "@/api/support/api";
import { getAnyToken } from "@/utils/token";

type NewSupportTicketClientProps = {
	personal_user: User;
	on_create?: (support_ticket: SupportTicket) => void;
};

const NewSupportTicket = (props: NewSupportTicketClientProps) => {
	const [title, setTitle] = useState<string>("");
	const [topic, setTopic] = useState<string>("");
	const [involved_users_ids, setInvolvedUsersIDs] = useState<number[]>([]);
	const [involved_users, setInvolvedUsers] = useState<User[]>([]);
	const [description, setDescription] = useState<string>("");

	const submitTicket = async (e: BaseSyntheticEvent) => {
		e.preventDefault();

		const new_ticket: SupportTicket = {
			id: -1,
			creator: props.personal_user.id,
			created: "",
			updated: "",
			issue_title: title,
			issue_topic: topic,
			issue_description: description,
			involved_users: involved_users_ids,
			status: 0,
			file_attachments: [],
		};

		const token = await getAnyToken();
		const response = await createNewSupportTicket(new_ticket, token);

		if (response) {
			if (props.on_create) {
				props.on_create(response);
			}
			window.location.href = `/support/ticket/${response.id}`;
		}
	};

	return (
		<>
			<h2>New Support Ticket</h2>
			<section className={style.field}>
				<label>Title</label>
				<input
					type="text"
					minLength={10}
					maxLength={255}
					placeholder="A brief title describing your issue..."
					onChange={(e: BaseSyntheticEvent) =>
						setTitle(e.target.value)
					}
				/>
			</section>
			{title.length >= 10 && (
				<section className={style.field}>
					<label>Topic</label>
					<select
						defaultValue={""}
						onChange={(e: BaseSyntheticEvent) =>
							setTopic(e.target.value)
						}
					>
						<option value=""></option>
						<option value="general">General</option>
						<option value="forum">Forum</option>
						<option value="store">Store</option>
						<option value="community">Community</option>
						<option value="game server">Game Server</option>
						<option value="users">User(s)</option>
					</select>
				</section>
			)}
			{topic !== "" && (
				<>
					{topic === "users" && (
						<section>
							<span>Involved User(s)</span>
						</section>
					)}
					<section className={style.field}>
						<label>Description</label>
						<textarea
							rows={10}
							minLength={50}
							maxLength={10_000}
							onChange={(e: BaseSyntheticEvent) =>
								setDescription(e.target.value)
							}
						></textarea>
					</section>
					{description.length >= 50 && (
						<button
							onClick={submitTicket}
							style={{ width: "fit-content" }}
						>
							Submit
						</button>
					)}
				</>
			)}
		</>
	);
};

export default NewSupportTicket;
