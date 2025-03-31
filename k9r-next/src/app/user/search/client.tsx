"use client";

import SearchBar from "@/components/search-bar/search-bar";
import style from "./search.module.scss";
import { BaseSyntheticEvent, useState } from "react";
import { User } from "@/api/users/models";
import { searchUsers } from "@/api/users/api";
import UserIcon from "@/components/user/user-icon/user-icon";
import Link from "next/link";
import UserPreview from "@/components/user/user-preview/user-preview";

const SearchUsersClient = () => {
	const [search, setSearch] = useState<string>("");
	const [page, setPage] = useState<number>(1);
	const [user_results, setUserResults] = useState<User[]>([]);

	const searchUser = async (e?: BaseSyntheticEvent) => {
		if (e) {
			e.preventDefault();
		}

		const search_results = await searchUsers(search, page);
		setUserResults(search_results);
	};

	return (
		<>
			<div className={style.content}>
				<h1>Search Users</h1>
				<SearchBar
					search={searchUser}
					set_search={setSearch}
					placeholder="Search users by ID, username, or display name"
				/>
			</div>
			<div className={style.content}>
				<h2>Results</h2>
				{user_results.map((user, index) => {
					if (user.oauth_type === "root-root-user") {
						return;
					}
					return (
						<Link
							href={`/user/${user.id}`}
							key={index + Math.random()}
							className={style.user}
						>
							<UserPreview user={user} />
						</Link>
					);
				})}
				{user_results.length <= 0 && <span>No results found.</span>}
			</div>
		</>
	);
};

export default SearchUsersClient;
