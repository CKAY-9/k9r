import { Usergroup } from "./usergroups/models";

export const CREATE_NEW_THREADS: number = 0x1;
export const CREATE_NEW_POSTS: number = 0x2;
export const EDIT_POSTS: number = 0x4;
export const EDIT_PROFILE: number = 0x8;
export const DEFAULT_COMMUNITY_ACCESS: number = 0x10;
export const EDIT_THREADS: number = 0x20;
export const EDIT_PROFILE_BANNER: number = 0x40;
export const SITE_SETTINGS: number = 0x10000;
export const MANAGE_USERS: number = 0x20000;
export const MANAGE_POSTS: number = 0x40000;
export const MANAGE_USERGROUPS: number = 0x80000;
export const MANAGE_DETAILS: number = 0x100000;
export const MANAGE_FORUMS: number = 0x200000;
export const MANAGE_COMMUNITY: number = 0x400000;
export const ROOT_ACCESS: number = 0x20000000;

export const generalManagementPermissionCheck = (usergroups: Usergroup[]) => {
	return usergroupsPermissionFlagCheck(
		usergroups,
		MANAGE_COMMUNITY |
			MANAGE_FORUMS |
			MANAGE_DETAILS |
			MANAGE_USERS |
			MANAGE_USERGROUPS |
			MANAGE_POSTS |
			SITE_SETTINGS
	);
};

export const usergroupsPermissionFlagCheck = (
	usergroups: Usergroup[],
	flag: number
) => {
	for (let i = 0; i < usergroups.length; i++) {
		const group = usergroups[i];
		if (group.permissions & ROOT_ACCESS) {
			return true;
		}

		if (group.permissions & flag) {
			return true;
		}
	}

	return false;
};
