"use server";

import { getCommunityDetails } from "@/api/community-details/api";
import { Metadata } from "next";
import IndexClient from "./client";
import { getStoredCookie } from "@/utils/stored-cookies";
import { getPersonalUser } from "@/api/users/api";

export const generateMetadata = async (): Promise<Metadata> => {
    const details = await getCommunityDetails();
    return {
        title: `Home - ${details.name}`,
        description: `Homepage for ${details.name}. ${details.description}`,
    };
}


const IndexPage = async () => {
	const details = await getCommunityDetails();

	const user_token = await getStoredCookie("token");
	const personal_user = await getPersonalUser(user_token);

	return (
		<>
			<IndexClient community_details={details} personal_user={personal_user} />
		</>
	);
}

export default IndexPage;