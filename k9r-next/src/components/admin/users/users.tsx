"use client";

import { User } from "@/api/users/models";
import { BaseSyntheticEvent, useEffect, useState } from "react";
import style from "./users.module.scss";
import { getUserFromID, searchUsers } from "@/api/users/api";
import SearchBar from "@/components/search-bar/search-bar";
import UserPreview from "@/components/user/user-preview/user-preview";
import UserTab from "@/components/user/user-tab/user-tab";
import { Usergroup } from "@/api/usergroups/models";
import {
	addUsertoUsergroupFromIDs,
	getAllUsergroups,
	removeUserFromUsergroupFromIDs,
} from "@/api/usergroups/api";
import Image from "next/image";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { getAnyToken } from "@/utils/token";

const UsersAdmin = () => {
	const [search, setSearch] = useState<string>("");
	const [page, _setPage] = useState<number>(1);
	const [user_results, setUserResults] = useState<User[]>([]);
	const [usergroups, setUsergroups] = useState<Usergroup[]>([]);
	const [selected_user, setSelectedUser] = useState<User | null>(null);
	const [add_usergroup, setAddUsergroup] = useState<boolean>(false);

	const router = useRouter();
	const pathname = usePathname();
	const searchParams = useSearchParams();
	const user_query = searchParams.get("user_query");

	useEffect(() => {
		if (user_query !== null) {
			(async () => {
				try {
					const user_id = Number.parseInt(user_query) || -1;
					const user_result = await getUserFromID(user_id);
					setSelectedUser(user_result);
					if (user_result !== null) {
						router.push(
							pathname +
								"?" +
								`tab=users&user_query=${user_result.id}`
						);
					}
				} catch {
					return;
				}
			})();
		}
	}, [user_query, pathname, router]);

	useEffect(() => {
		(async () => {
			const us = await getAllUsergroups();
			setUsergroups(us);
		})();
	}, []);

	const searchUser = async (e?: BaseSyntheticEvent) => {
		if (e) {
			e.preventDefault();
		}

		const search_results = await searchUsers(search, page);
		setUserResults(search_results);
	};

	const addUsergroup = async (
		e: BaseSyntheticEvent,
		usergroup_id: number
	) => {
		e.preventDefault();

		if (selected_user === null) {
			return;
		}

		const response = await addUsertoUsergroupFromIDs(
			selected_user.id,
			usergroup_id,
			await getAnyToken()
		);
		if (response !== null) {
			setSelectedUser(response);
			setAddUsergroup(false);
		}
	};

	const removeUsergroup = async (
		e: BaseSyntheticEvent,
		usergroup_id: number
	) => {
		e.preventDefault();

		if (selected_user === null) {
			return;
		}

		const response = await removeUserFromUsergroupFromIDs(
			selected_user.id,
			usergroup_id,
			await getAnyToken()
		);
		if (response !== null) {
			setSelectedUser(response);
			setAddUsergroup(false);
		}
	};

	return (
		<div className={`${style.container} flex col gap-1`}>
			{selected_user === null ? (
				<>
					<section>
						<h2>Manage Users</h2>
						<SearchBar
							search={searchUser}
							set_search={setSearch}
							placeholder="Search users by ID, username, or display name"
						/>
					</section>
					<div className={`flex col gap-1`}>
						<h2>Results</h2>
						{user_results.map((user, index) => {
							if (user.oauth_type === "root-root-user") {
								return;
							}
							return (
								<button
									key={index + Math.random()}
									onClick={(e: BaseSyntheticEvent) => {
										e.preventDefault();
										router.push(
											pathname +
												"?" +
												`tab=users&user_query=${user.id}`
										);
										setSelectedUser(user);
									}}
									style={{ padding: "0" }}
									className="no-border"
								>
									<UserPreview user={user} />
								</button>
							);
						})}
						{user_results.length <= 0 && (
							<span>No results found.</span>
						)}
					</div>
				</>
			) : (
				<>
					<button
						onClick={(e: BaseSyntheticEvent) => {
							e.preventDefault();
							router.push(pathname + "?" + `tab=users`);
							setSelectedUser(null);
						}}
						className="no-border"
						style={{"width": "fit-content"}}
					>
						Back
					</button>
					<UserTab user={selected_user} />
					<span>Display Name: {selected_user.display_name}</span>
					<span>Username: {selected_user.username}</span>
					<span>Description: {selected_user.description}</span>
					<span>
						Joined:{" "}
						{new Date(selected_user.joined).toLocaleString()}
					</span>
					<span>OAuth: {selected_user.oauth_type}</span>
					<span>Usergroups <span style={{"opacity": "0.5"}}>(click to remove)</span></span>
					<section>
						<section className={`flex wrap row gap-1`}>
							{usergroups
								.filter((usergroup, _index) =>
									selected_user.usergroups.includes(
										usergroup.id
									)
								)
								.map((usergroup, index) => {
									return (
										<button
											onClick={(e: BaseSyntheticEvent) =>
												removeUsergroup(e, usergroup.id)
											}
											key={index}
											className="no-border"
										>
											{usergroup.icon !== "" && (
												<Image
													src={usergroup.icon}
													alt="Usergroup Icon"
													sizes="100%"
													width={0}
													height={0}
												/>
											)}
											<span
												style={{
													color: usergroup.color,
												}}
											>
												{usergroup.name}
											</span>
										</button>
									);
								})}
							<div className={`flex row align gap-half`}>
								{usergroups.length !==
									selected_user.usergroups.length && (
									<button
										className="no-border"
										onClick={() =>
											setAddUsergroup(!add_usergroup)
										}
									>
										Add
									</button>
								)}
								{add_usergroup && (
									<div className={style.add_usergroup}>
										<select
											onChange={(e: BaseSyntheticEvent) =>
												addUsergroup(
													e,
													Number.parseInt(
														e.target.value
													)
												)
											}
										>
											<option value=""></option>
											{usergroups
												.filter(
													(usergroup, _index) =>
														!selected_user.usergroups.includes(
															usergroup.id
														)
												)
												.map((usergroup, index) => {
													return (
														<option
															key={index}
															value={usergroup.id}
															style={{
																color: `${usergroup.color}`,
															}}
														>
															{usergroup.name}
														</option>
													);
												})}
										</select>
									</div>
								)}
							</div>
						</section>
					</section>
				</>
			)}
		</div>
	);
};

export default UsersAdmin;
