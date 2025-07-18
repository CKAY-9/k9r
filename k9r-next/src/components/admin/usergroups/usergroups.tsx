"use client";

import { BaseSyntheticEvent, useEffect, useState } from "react";
import style from "./usergroups.module.scss";
import { Usergroup } from "@/api/usergroups/models";
import {
	deleteUsergroupFromID,
	getAllUsergroups,
	updateUsergroupFromID,
} from "@/api/usergroups/api";
import LoadingAlert from "@/components/loading/loading-alert";
import {
	CREATE_NEW_POSTS,
	CREATE_NEW_THREADS,
	DEFAULT_COMMUNITY_ACCESS,
	EDIT_POSTS,
	EDIT_PROFILE,
	EDIT_PROFILE_BANNER,
	EDIT_THREADS,
	MANAGE_DETAILS,
	MANAGE_FORUMS,
	MANAGE_POSTS,
	MANAGE_USERGROUPS,
	MANAGE_USERS,
	ROOT_ACCESS,
	SITE_SETTINGS,
} from "@/api/permissions";
import { getAnyToken } from "@/utils/token";

const UsergroupsAdmin = () => {
	const [usergroups, setUsergroups] = useState<Usergroup[]>([]);
	const [loading_usergroups, setLoadingUsergroups] = useState<boolean>(true);
	const [usergroup_index, setUsergroupIndex] = useState<number>(-1);

	useEffect(() => {
		(async () => {
			const us = await getAllUsergroups();

			setUsergroups(us);
			setLoadingUsergroups(false);
		})();
	}, []);

	const generateNewUsergroup = async (e: BaseSyntheticEvent) => {
		e.preventDefault();

		const new_group: Usergroup = {
			id: -1,
			name: `New Usergroup #${usergroups.length + 1}`,
			color: "#ffffff",
			permissions: 0,
			icon: "",
		};

		setUsergroupIndex(usergroups.length);
		setUsergroups((old) => [...old, new_group]);
	};

	const togglePermission = (flag: number) => {
		if (usergroups[usergroup_index].permissions & flag) {
			usergroups[usergroup_index].permissions =
				usergroups[usergroup_index].permissions & ~flag;
		} else {
			usergroups[usergroup_index].permissions =
				usergroups[usergroup_index].permissions | flag;
		}
		setUsergroups(usergroups);
	};

	const updateUsergroup = async (e: BaseSyntheticEvent) => {
		e.preventDefault();

		if (usergroup_index < 0 || usergroup_index >= usergroups.length) {
			return;
		}

		const current = usergroups[usergroup_index];
		if (current === null) {
			return;
		}

		const update = await updateUsergroupFromID(
			current.id,
			current,
			await getAnyToken()
		);
		if (update !== null) {
			setUsergroups(usergroups.filter((v) => v.id !== update.id));
			setLoadingUsergroups(true);
			setUsergroups((old) => [...old, update]);
			setUsergroupIndex(usergroups.length - 1);
			setLoadingUsergroups(false);
		}
	};

	const deleteUsergroup = async (e: BaseSyntheticEvent) => {
		e.preventDefault();

		if (usergroup_index < 0 || usergroup_index >= usergroups.length) {
			return;
		}

		const current = usergroups[usergroup_index];
		if (current === null || current.id === 1 || current.id === 2) {
			return;
		}

		await deleteUsergroupFromID(current.id, await getAnyToken());
	};

	if (loading_usergroups) {
		return (
			<div className={`${style.container} flex row gap-1`}>
				<LoadingAlert />
			</div>
		);
	}

	return (
		<div className={`${style.container} flex row gap-1`}>
			<nav className="flex col">
				{usergroups.map((usergroup, index) => {
					return (
						<button
							onClick={() => {
								setUsergroupIndex(index);
							}}
							key={index}
							className="no-border"
							style={{ color: `${usergroup.color}` }}
						>
							{usergroup.name}
						</button>
					);
				})}
				<button className="no-border" onClick={generateNewUsergroup}>
					Create New
				</button>
			</nav>
			<div className={`flex col gap-1 flex-1`} style={{"padding": "1rem"}}>
				{usergroup_index === -1 && (
					<>
						<h2>Usergroups</h2>
						<span>
							Select a usergroup to edit it, or create a new one.
						</span>
					</>
				)}
				{usergroups
					.filter((_v, i) => i === usergroup_index)
					.map(() => {
						return (
							<div
								className={`flex col gap-1`}
								key={usergroup_index}
							>
								<section>
									<h2
										style={{
											color: `${usergroups[usergroup_index].color}`,
										}}
									>
										{usergroups[usergroup_index].name}
									</h2>
									{(usergroups[usergroup_index].id === 1 ||
										usergroups[usergroup_index].id ===
											2) && (
										<span style={{ opacity: "0.5" }}>
											(This is a default usergroup. It
											cannot be deleted)
										</span>
									)}
								</section>
								<section className={`flex col gap-half`}>
									<label>Name</label>
									<input
										id={`${usergroup_index}`}
										type="text"
										defaultValue={
											usergroups[usergroup_index].name
										}
										style={{
											color: `${usergroups[usergroup_index].color}`,
										}}
										onChange={(e: BaseSyntheticEvent) => {
											usergroups[usergroup_index].name =
												e.target.value;
										}}
									/>
								</section>
								<section className={`flex col gap-half`}>
									<label>Color</label>
									<input
										type="color"
										defaultValue={
											usergroups[usergroup_index].color
										}
										onChange={(e: BaseSyntheticEvent) => {
											usergroups[usergroup_index].color =
												e.target.value;
										}}
									/>
								</section>
								<section>
									<label>Permissions</label>
									<div className={`flex col gap-half`} style={{"flexWrap": "wrap"}}>
										<section className={style.permission}>
											<label>Create New Thread</label>
											<input
												defaultChecked={
													(usergroups[usergroup_index]
														.permissions &
														CREATE_NEW_THREADS) !==
													0
												}
												type="checkbox"
												onChange={(
													_e: BaseSyntheticEvent
												) => {
													togglePermission(
														CREATE_NEW_THREADS
													);
												}}
											/>
										</section>
										<section className={style.permission}>
											<label>Create New Posts</label>
											<input
												defaultChecked={
													(usergroups[usergroup_index]
														.permissions &
														CREATE_NEW_POSTS) !==
													0
												}
												type="checkbox"
												onChange={(
													_e: BaseSyntheticEvent
												) => {
													togglePermission(
														CREATE_NEW_POSTS
													);
												}}
											/>
										</section>
										<section className={style.permission}>
											<label>Edit Posts</label>
											<input
												defaultChecked={
													(usergroups[usergroup_index]
														.permissions &
														EDIT_POSTS) !==
													0
												}
												type="checkbox"
												onChange={(
													_e: BaseSyntheticEvent
												) => {
													togglePermission(
														EDIT_POSTS
													);
												}}
											/>
										</section>
										<section className={style.permission}>
											<label>Edit Profile</label>
											<input
												defaultChecked={
													(usergroups[usergroup_index]
														.permissions &
														EDIT_PROFILE) !==
													0
												}
												type="checkbox"
												onChange={(
													_e: BaseSyntheticEvent
												) => {
													togglePermission(
														EDIT_PROFILE
													);
												}}
											/>
										</section>
										<section className={style.permission}>
											<label>
												Default Community Access
											</label>
											<input
												defaultChecked={
													(usergroups[usergroup_index]
														.permissions &
														DEFAULT_COMMUNITY_ACCESS) !==
													0
												}
												type="checkbox"
												onChange={(
													_e: BaseSyntheticEvent
												) => {
													togglePermission(
														DEFAULT_COMMUNITY_ACCESS
													);
												}}
											/>
										</section>
										<section className={style.permission}>
											<label>Edit Threads</label>
											<input
												defaultChecked={
													(usergroups[usergroup_index]
														.permissions &
														EDIT_THREADS) !==
													0
												}
												type="checkbox"
												onChange={(
													_e: BaseSyntheticEvent
												) => {
													togglePermission(
														EDIT_THREADS
													);
												}}
											/>
										</section>
										<section className={style.permission}>
											<label>Edit Profile Banner</label>
											<input
												defaultChecked={
													(usergroups[usergroup_index]
														.permissions &
														EDIT_PROFILE_BANNER) !==
													0
												}
												type="checkbox"
												onChange={(
													_e: BaseSyntheticEvent
												) => {
													togglePermission(
														EDIT_PROFILE_BANNER
													);
												}}
											/>
										</section>
										<section className={style.permission}>
											<label>Site Settings</label>
											<input
												defaultChecked={
													(usergroups[usergroup_index]
														.permissions &
														SITE_SETTINGS) !==
													0
												}
												type="checkbox"
												onChange={(
													_e: BaseSyntheticEvent
												) => {
													togglePermission(
														SITE_SETTINGS
													);
												}}
											/>
										</section>
										<section className={style.permission}>
											<label>Manage Users</label>
											<input
												defaultChecked={
													(usergroups[usergroup_index]
														.permissions &
														MANAGE_USERS) !==
													0
												}
												type="checkbox"
												onChange={(
													_e: BaseSyntheticEvent
												) => {
													togglePermission(
														MANAGE_USERS
													);
												}}
											/>
										</section>
										<section className={style.permission}>
											<label>Manage Posts</label>
											<input
												defaultChecked={
													(usergroups[usergroup_index]
														.permissions &
														MANAGE_POSTS) !==
													0
												}
												type="checkbox"
												onChange={(
													_e: BaseSyntheticEvent
												) => {
													togglePermission(
														MANAGE_POSTS
													);
												}}
											/>
										</section>
										<section className={style.permission}>
											<label>Manage Usergroups</label>
											<input
												defaultChecked={
													(usergroups[usergroup_index]
														.permissions &
														MANAGE_USERGROUPS) !==
													0
												}
												type="checkbox"
												onChange={(
													_e: BaseSyntheticEvent
												) => {
													togglePermission(
														MANAGE_USERGROUPS
													);
												}}
											/>
										</section>
										<section className={style.permission}>
											<label>Manage Details</label>
											<input
												defaultChecked={
													(usergroups[usergroup_index]
														.permissions &
														MANAGE_DETAILS) !==
													0
												}
												type="checkbox"
												onChange={(
													_e: BaseSyntheticEvent
												) => {
													togglePermission(
														MANAGE_DETAILS
													);
												}}
											/>
										</section>
										<section className={style.permission}>
											<label>Manage Forums</label>
											<input
												defaultChecked={
													(usergroups[usergroup_index]
														.permissions &
														MANAGE_FORUMS) !==
													0
												}
												type="checkbox"
												onChange={(
													_e: BaseSyntheticEvent
												) => {
													togglePermission(
														MANAGE_FORUMS
													);
												}}
											/>
										</section>
										<section className={style.permission}>
											<label>
												Root Access (This is gives
												permission for everything)
											</label>
											<input
												defaultChecked={
													(usergroups[usergroup_index]
														.permissions &
														ROOT_ACCESS) !==
													0
												}
												type="checkbox"
												onChange={(
													_e: BaseSyntheticEvent
												) => {
													togglePermission(
														ROOT_ACCESS
													);
												}}
											/>
										</section>
									</div>
								</section>
								<button onClick={updateUsergroup}>
									Update
								</button>
								{usergroups[usergroup_index].id !== 1 &&
									usergroups[usergroup_index].id !== 2 && (
										<button onClick={deleteUsergroup}>
											Delete
										</button>
									)}
							</div>
						);
					})}
			</div>
		</div>
	);
};

export default UsergroupsAdmin;
