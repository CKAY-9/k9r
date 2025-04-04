"use client";

import { User } from "@/api/users/models";
import style from "./settings.module.scss";
import { BaseSyntheticEvent, useEffect, useState } from "react";
import { deleteUser, getUserUserGroupsFromID, updateUserByToken } from "@/api/users/api";
import { eraseCookie, getCookie } from "@/utils/cookies";
import { deleteAllUserPosts, deleteAllUserThreads } from "@/api/forum/api";
import ImageUpload from "@/components/image-upload/image-upload";
import { EDIT_PROFILE_BANNER, usergroupsPermissionFlagCheck } from "@/api/permissions";
import NavigateBack from "@/components/nav-back/nav-back";

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
	const [avatar_url, setAvatarURL] = useState<string>(
		props.personal_user.avatar || ""
	)
	const [banner_url, setBannerURL] = useState<string>(
		props.personal_user.banner || ""
	)
	const [banner_access, setBannerAccess] = useState<boolean>(false);

    const updateAccount = async (e?: BaseSyntheticEvent) => {
		if (e) {
			e.preventDefault();
		}

		props.personal_user.display_name = display_name;
		props.personal_user.description = description;
		props.personal_user.avatar = avatar_url;
		props.personal_user.banner = banner_url;
		const response = await updateUserByToken(props.personal_user, getCookie("token") || "");
		if (response !== null) {

		}
    }

	const deleteThreads = async (e: BaseSyntheticEvent) => {
		e.preventDefault();

		const _response = await deleteAllUserThreads(getCookie("token") || "");
	}

	const deletePosts = async (e: BaseSyntheticEvent) => {
		e.preventDefault();
		
		const _response = await deleteAllUserPosts(getCookie("token") || "");
	}

	const deleteAccount = async (e: BaseSyntheticEvent) => {
		
		const response = await deleteUser(getCookie("token") || "");
		if (response) {
			eraseCookie("token");
			window.location.href = "/user/login";
		}
	}

	const avatarUpdate = (new_url: string) => {
		setAvatarURL(new_url);
		updateAccount();
	}

	const bannerUpdate = (new_url: string) => {
		setBannerURL(new_url);
		updateAccount();
	}

	useEffect(() => {
		(async () => {
			const usergroups = await getUserUserGroupsFromID(props.personal_user.id, getCookie("token") || "");
			setBannerAccess(usergroupsPermissionFlagCheck(usergroups, EDIT_PROFILE_BANNER));
		})();
	}, [props.personal_user.id])

	return (
		<>
			<NavigateBack />
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
					<label>Avatar</label>
					<ImageUpload on_upload={avatarUpdate} default_image_url={avatar_url} />
				</section>
				<section className={style.setting}>
					<label>Banner</label>
					{banner_access ? (
						<ImageUpload on_upload={bannerUpdate} default_image_url={banner_url} />
					) : (
						<span>Requires special access.</span>
					)}
				</section>
                <button onClick={updateAccount}>Update</button>
			</section>
            <section className={style.settings_section}>
				<h2>Dangerous</h2>
                <button onClick={deletePosts}>Delete all posts</button>
                <button onClick={deleteThreads}>Delete all threads</button>
				<button onClick={deleteAccount}>Delete account</button>
			</section>
		</>
	);
};

export default UserSettingsPageClient;
