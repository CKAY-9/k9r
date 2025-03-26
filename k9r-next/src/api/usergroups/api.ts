import axios from "axios";
import { Usergroup } from "./models";
import { K9R_API } from "../resources";
import { User } from "../users/models";

export const getUsergroupFromID = async (
	id: number
): Promise<Usergroup | null> => {
	try {
		const request = await axios({
			url: `${K9R_API}/usergroup/${id}`,
			method: "GET",
		});
		return request.data;
	} catch {
		return null;
	}
};

export const getAllUsergroups = async (): Promise<Usergroup[]> => {
	try {
		const request = await axios({
			url: `${K9R_API}/usergroup`,
			method: "GET",
		});
		return request.data;
	} catch {
		return [];
	}
};

export const updateUsergroupFromID = async (
	id: number,
	usergroup: Usergroup,
	token: string
): Promise<Usergroup | null> => {
	try {
		const request = await axios({
			url: `${K9R_API}/usergroup/${id}`,
			method: "PUT",
			headers: {
				Authorization: token,
			},
			data: usergroup,
		});
		return request.data;
	} catch {
		return null;
	}
};

export const deleteUsergroupFromID = async (
	id: number,
	token: string
): Promise<boolean> => {
	try {
		await axios({
			url: `${K9R_API}/usergroup/${id}`,
			method: "DELETE",
			headers: {
				Authorization: token,
			},
		});
		return true;
	} catch {
		return false;
	}
};

export const createNewUsergroup = async (
	usergroup: Usergroup,
	token: string
): Promise<Usergroup | null> => {
	try {
		const request = await axios({
			url: `${K9R_API}/usergroup`,
			method: "POST",
			headers: {
				Authorization: token,
			},
			data: usergroup,
		});
		return request.data;
	} catch {
		return null;
	}
};

export const addUsertoUsergroupFromIDs = async (
	user_id: number,
	usergroup_id: number,
    token: string
): Promise<User | null> => {
    try {
        const request = await axios({
            url: `${K9R_API}/user/${user_id}/add_usergroup/${usergroup_id}`,
            method: "POST",
            headers: {
                Authorization: token
            },
        })
        return request.data;
    } catch {
        return null;
    }
};

export const removeUserFromUsergroupFromIDs = async (
	user_id: number,
	usergroup_id: number,
    token: string
): Promise<User | null> => {
    try {
        const request = await axios({
            url: `${K9R_API}/user/${user_id}/remove_usergroup/${usergroup_id}`,
            method: "DELETE",
            headers: {
                Authorization: token
            },
        })
        return request.data;
    } catch {
        return null;
    }
};
