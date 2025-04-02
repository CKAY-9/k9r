import axios from "axios";
import { K9R_API } from "../resources";
import { ImageResponse } from "./models";

export const uploadFile = async (
	body: any,
	token: string
): Promise<ImageResponse | null> => {
	try {
		const request = await axios({
			url: `${K9R_API}/storage/upload`,
			method: "POST",
            data: body,
            headers: {
                Authorization: token
            }
		});

        return request.data;
	} catch {
		return null;
	}
};

export const deleteFile = async (
	filename: string,
	token: string
): Promise<any> => {
	try {
		const request = await axios({
			url: `${K9R_API}/storage/delete/${filename}`,
			method: "DELETE",
			headers: {
				Authorization: token
			}
		});
        return request.data;
	} catch {
		return null;
	}
};

export const getFile = async (
	filename: string,
): Promise<ImageResponse | null> => {
	try {
		const request = await axios({
			url: `${K9R_API}/storage/files/${filename}`,
			method: "GET"
		});
        return request.data;
	} catch {
		return null;
	}
};

export const getFileURL = async (
	filename: string,
): Promise<ImageResponse | null> => {
	try {
		const request = await axios({
			url: `${K9R_API}/storage/file_url/${filename}`,
			method: "GET"
		});
        return request.data;
	} catch {
		return null;
	}
};
