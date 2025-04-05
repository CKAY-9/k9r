import axios from "axios";
import { CommunityDetails } from "./models";
import { K9R_API } from "../resources";

export const getCommunityDetails = async (
	token?: string
): Promise<CommunityDetails> => {
	try {
		const request = await axios({
			url: `${K9R_API}/community/details`,
			method: "GET",
			headers: {
				Authorization: token || "",
			},
		});
		return request.data;
	} catch {
		return {
			id: -1,
			name: "K9-Revive",
			description:
				"An absolute overhaul to K9-Forums. The perfect website.",
			features: [true, true, true],
		};
	}
};

export const updateCommunityDetails = async (
	token: string,
	community_details: CommunityDetails
): Promise<CommunityDetails | null> => {
	try {
		const request = await axios({
			url: `${K9R_API}/community/details`,
			method: "PUT",
			headers: {
				Authorization: token,
			},
			data: community_details,
		});
		return request.data;
	} catch {
		return null;
	}
};
