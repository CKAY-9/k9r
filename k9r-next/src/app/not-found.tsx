"use server";

import { getCommunityDetails } from "@/api/community-details/api";
import { Metadata } from "next";
import { getStoredCookie } from "@/utils/stored-cookies";
import { getPersonalUser } from "@/api/users/api";
import Header from "@/components/header/header";
import Footer from "@/components/footer/footer";
import NavigateBack from "@/components/nav-back/nav-back";

export const generateMetadata = async (): Promise<Metadata> => {
    const details = await getCommunityDetails();
    return {
        title: `Not Found - ${details.name}`,
        description: `Sorry, {details.name} was unable to find your requested page.`,
    };
}

const NotFound = async () => {
	const details = await getCommunityDetails();

	const user_token = await getStoredCookie("token");
	const personal_user = await getPersonalUser(user_token);

	return (
		<>
			<Header personal_user={personal_user} community_details={details} />
            <div className="container flex gap-1 align justify">
                <h1>404 Error: Not Found</h1>
                <span>Sorry, {details.name} was unable to find your requested page.</span>
                <NavigateBack />
            </div>
            <Footer community_details={details} />
		</>
	);
}

export default NotFound;