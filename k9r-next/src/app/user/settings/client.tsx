"use client";

import { User } from "@/api/users/models";
import style from "./settings.module.scss";
import { BaseSyntheticEvent, useState } from "react";
import { updateUserByToken } from "@/api/users/api";
import { getCookie } from "@/utils/cookies";

type UserSettingsPageClientProps = {
	personal_user: User;
};

const UserSettingsPageClient = (props: UserSettingsPageClientProps) => {
	const [display_name, setDisplayName] = useState<string>(
		props.personal_user.display_name || ""
	);
	const [description, setDescription] = useState<string>(
		props.personal_user.description || ""
	);

    const updateAccount = async (e: BaseSyntheticEvent) => {
		e.preventDefault();

		props.personal_user.display_name = display_name;
		props.personal_user.description = description;
		const response = await updateUserByToken(props.personal_user, getCookie("token") || "");
		if (response !== null) {

		}
    }

	return (
		<>
			<h1>Settings</h1>
			<section className={style.settings_section}>
				<h2>Account</h2>
                <section className={style.setting}>
					<label>Username (can&apos;t be changed)</label>
					<label>{props.personal_user.username}</label>
				</section>
				<section className={style.setting}>
					<label>Display Name</label>
					<input
						type="text"
						defaultValue={display_name}
						onChange={(e: BaseSyntheticEvent) =>
							setDisplayName(e.target.value)
						}
					/>
				</section>
                <section className={style.setting}>
					<label>Description</label>
					<textarea
						rows={5}
                        cols={50}
						defaultValue={description}
						onChange={(e: BaseSyntheticEvent) =>
							setDescription(e.target.value)
						}
					/>
				</section>
                <section className={style.setting}>
					<label>Profile Picture</label>
					<span>TODO: Add file uploading...</span>
				</section>
                <button onClick={updateAccount}>Update</button>
			</section>
            <section className={style.settings_section}>
				<h2>Activity</h2>
                <button>Delete all posts</button>
                <button>Delete all threads</button>
			</section>
		</>
	);
};

export default UserSettingsPageClient;
