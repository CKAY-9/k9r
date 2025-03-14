"use server";

import { getCommunityDetails } from "@/api/community-details/api";
import { getPersonalUser } from "@/api/users/api";
import Footer from "@/components/footer/footer";
import Header from "@/components/header/header";
import { getStoredCookie } from "@/utils/stored-cookies";
import { Metadata } from "next";

export const generateMetadata = async (): Promise<Metadata> => {
    const details = await getCommunityDetails();
    return {
        title: `Store - ${details.name}`,
        description: `Store page for ${details.name}. ${details.description}`,
    };
}

const StoreHomePage = async () => {
    const details = await getCommunityDetails();

    const user_token = await getStoredCookie("token");
    const personal_user = await getPersonalUser(user_token);

    return (
        <>
            <Header personal_user={personal_user} community_details={details} />
            <main className="container">

            </main>
            <Footer community_details={details} />
        </>
    );
}

export default StoreHomePage;