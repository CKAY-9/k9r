"use server";

import { getCommunityDetails } from "@/api/community-details/api";
import { Metadata } from "next";
import { getStoredCookie } from "@/utils/stored-cookies";
import { getPersonalUser } from "@/api/users/api";
import Header from "@/components/header/header";
import Footer from "@/components/footer/footer";
import { redirect } from "next/navigation";

export const generateMetadata = async (): Promise<Metadata> => {
    const details = await getCommunityDetails();
    return {
        title: `User Settings - ${details.name}`,
        description: `User settings for ${details.name}. Manage your account and preferences here. ${details.description}`,
    };
}

const UserSettingsPage = async () => {
	const details = await getCommunityDetails();

	const user_token = await getStoredCookie("token");
	const personal_user = await getPersonalUser(user_token);

    if (personal_user === null) {
        return redirect("/user/login");
    }

	return (
		<>
            <Header personal_user={personal_user} community_details={details} />
            <main className="container">
                
            </main>
            <Footer community_details={details} />
		</>
	);
}

export default UserSettingsPage;