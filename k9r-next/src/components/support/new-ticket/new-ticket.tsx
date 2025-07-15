"use client";

import { User } from "@/api/users/models";
import style from "./new.module.scss";
import { BaseSyntheticEvent, useEffect, useState } from "react";
import { SupportTicket } from "@/api/support/models";
import { createNewSupportTicket } from "@/api/support/api";
import { getAnyToken } from "@/utils/token";
import { usePathname, useSearchParams, useRouter } from "next/navigation";
import { getUserFromID, searchUsers } from "@/api/users/api";
import UserTab from "@/components/user/user-tab/user-tab";
import MaterialIcon from "@/components/material-icon/material-icon";
import Popup from "@/components/popup/popup";
import SearchBar from "@/components/search-bar/search-bar";

type NewSupportTicketClientProps = {
	personal_user: User;
	on_create?: (support_ticket: SupportTicket) => void;
};

const NewSupportTicket = (props: NewSupportTicketClientProps) => {
	const router = useRouter();
	const pathname = usePathname();
	const searchParams = useSearchParams();
	const reported_user_id_param = searchParams.get("report_user");
	const reported_user_id = Number.parseInt(reported_user_id_param || "0");

	const [title, setTitle] = useState<string>("");
	const [topic, setTopic] = useState<string>("");
	const [involved_users_ids, setInvolvedUsersIDs] = useState<number[]>([]);
	const [involved_users, setInvolvedUsers] = useState<User[]>([]);
	const [description, setDescription] = useState<string>("");
	const [show_add_user, setShowAddUsers] = useState<boolean>(false);
	const [user_search, setUserSearch] = useState<string>("");
	const [search_results, setSearchResults] = useState<User[]>([]);
	const [page, setPage] = useState<number>(1);

	useEffect(() => {
		(async () => {
			const reported_user = await getUserFromID(reported_user_id);
			if (reported_user) {
				setInvolvedUsers((old) => [...old, reported_user]);
				setInvolvedUsersIDs((old) => [...old, reported_user_id]);

				setTitle(`Reporting user: ${reported_user.display_name}`);
				setTopic("users");

				router.push(
					pathname +
						"?" +
						"tab=newticket&report_user=" +
						reported_user_id
				);
			}
		})();
	}, [reported_user_id, reported_user_id_param, router, pathname]);

	const searchNewUserToAdd = async () => {
		const search_results = await searchUsers(user_search, page);
		setSearchResults(search_results);
	};

	const addUserToTicket = (user: User) => {
		setShowAddUsers(false);
		setInvolvedUsers((old) => [...old, user]);
		setInvolvedUsersIDs((old) => [...old, user.id]);
	};

	const removeUserFromTicket = (user_id: number) => {
		setInvolvedUsers(involved_users.filter((user) => user.id !== user_id));
		setInvolvedUsersIDs(
			involved_users_ids.filter((user) => user !== user_id)
		);
	};

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
			{show_add_user && (
				<>
					<Popup close={() => setShowAddUsers(false)}>
						<div
							style={{ padding: "1rem" }}
							className="flex col gap-1"
						>
							<h2>Report User</h2>
							<SearchBar
								placeholder="Search users by display name, username, and ID"
								search={searchNewUserToAdd}
								set_search={setUserSearch}
							/>
							<div
								className="flex col gap-1"
								style={{
									maxHeight: "500px",
									overflowY: "auto",
								}}
							>
								{search_results.map((user, index) => {
									return (
										<button
											key={index}
											onClick={() =>
												addUserToTicket(user)
											}
										>
											<UserTab user={user} />
										</button>
									);
								})}
							</div>
						</div>
					</Popup>
				</>
			)}
			<h2>New Support Ticket</h2>
			<section className={style.field}>
				<label>Title</label>
				<input
					type="text"
					minLength={10}
					maxLength={255}
					placeholder="A brief title describing your issue..."
					defaultValue={title}
					onChange={(e: BaseSyntheticEvent) =>
						setTitle(e.target.value)
					}
				/>
			</section>
			{title.length >= 10 && (
				<section className={style.field}>
					<label>Topic</label>
					<select
						defaultValue={topic}
						onChange={(e: BaseSyntheticEvent) =>
							setTopic(e.target.value)
						}
					>
						<option value=""></option>
						<option value="general">General</option>
						<option value="forum">Forum</option>
						<option value="community">Community</option>
						<option value="game server">Game Server</option>
						<option value="users">User(s)</option>
					</select>
				</section>
			)}
			{topic !== "" && (
				<>
					{topic === "users" ? (
						<>
							<section>
								<span>Involved User(s)</span>
								<div className="flex row gap-1 align wrap">
									{involved_users.map((user, index) => {
										return (
											<button
												onClick={() =>
													removeUserFromTicket(
														user.id
													)
												}
												key={index}
											>
												<UserTab user={user} />
											</button>
										);
									})}
									<button
										onClick={() => setShowAddUsers(true)}
									>
										<MaterialIcon
											src="/icons/add.svg"
											alt="Add User"
											size_rems={2}
										/>
									</button>
								</div>
							</section>

							{involved_users_ids.length >= 1 && (
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
							)}
						</>
					) : (
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
					)}
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
