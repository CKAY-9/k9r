import { Usergroup } from "./usergroups/models";

export const CREATE_NEW_POSTS_FLAG: number = 0x1;
export const REPLY_POSTS_FLAG: number = 0x2;
export const EDIT_POSTS_REPLIES_FLAG: number = 0x4;
export const EDIT_PROFILE_FLAG: number = 0x8;
export const DEFAULT_COMMUNITY_ACCESS_FLAG: number = 0x10;
export const SITE_SETTINGS: number = 0x10000;
export const MANAGE_USERS: number = 0x20000;
export const MANAGE_POSTS: number = 0x40000;
export const MANAGE_USERGROUPS: number = 0x80000;
export const MANAGE_DETAILS: number = 0x100000;
export const MANAGE_FORUMS: number = 0x200000;
export const ROOT_ACCESS_FLAG: number = 0x20000000;

export const usergroupsPermissionFlagCheck = (
    usergroups: Usergroup[],
    flag: number
) => {
    for (let i = 0; i < usergroups.length; i++) {
        const group = usergroups[i];    
        if (group.permissions & ROOT_ACCESS_FLAG) {
            return true
        }

        if (group.permissions & flag) {
            return true;
        }
    }

    return false;
}