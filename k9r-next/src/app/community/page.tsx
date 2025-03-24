"use server";

import { getCommunityDetails } from "@/api/community-details/api";
import { getPersonalUser } from "@/api/users/api";
import Footer from "@/components/footer/footer";
import Header from "@/components/header/header";
import { getStoredCookie } from "@/utils/stored-cookies";
import { Metadata } from "next";
import CommunityPageClient from "./client";

export const generateMetadata = async (): Promise<Metadata> => {
    const details = await getCommunityDetails();
    return {
        title: `Community - ${details.name}`,
        description: `Community homepage for ${details.name}. ${details.description}`,
    };
}

const CommunityHomePage = async () => {
    const details = await getCommunityDetails();

    const user_token = await getStoredCookie("token");
    const personal_user = await getPersonalUser(user_token);

    return (
        <>
            <Header personal_user={personal_user} community_details={details} />
            <main className="container" style={{"gap": "1rem"}}>
                <CommunityPageClient community_details={details} />
            </main>
            <Footer community_details={details} />
        </>
    );
}

export default CommunityHomePage;