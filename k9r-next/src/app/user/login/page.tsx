"use server";

import { getCommunityDetails } from "@/api/community-details/api";
import { Metadata } from "next";
import LoginClient from "./client";
import { getStoredCookie } from "@/utils/stored-cookies";
import { getPersonalUser } from "@/api/users/api";

export const generateMetadata = async (): Promise<Metadata> => {
    const details = await getCommunityDetails();
    return {
        title: `Login - ${details.name}`,
        description: `Login to ${details.name} using whatever method you like. ${details.description}`,
    };
}

const UserLoginPage = async () => {
    const details = await getCommunityDetails();

    const user_token = await getStoredCookie("token");
    const personal_user = await getPersonalUser(user_token);

    return (
        <>
            <LoginClient personal_user={personal_user} community_details={details} />
        </>
    );
}

export default UserLoginPage;