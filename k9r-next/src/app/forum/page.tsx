"use server";

import { getCommunityDetails } from "@/api/community-details/api";
import { createNewForumThread } from "@/api/forum/api";
import { getPersonalUser } from "@/api/users/api";
import Footer from "@/components/footer/footer";
import ForumContainer from "@/components/forum/container/forum-container";
import ForumContent from "@/components/forum/content/forum-content";
import ForumHeader from "@/components/forum/header/forum-header";
import ForumInfo from "@/components/forum/info/forum-info";
import ForumSections from "@/components/forum/sections/forum-sections";
import Header from "@/components/header/header";
import { getStoredCookie } from "@/utils/stored-cookies";
import { Metadata } from "next";

export const generateMetadata = async (): Promise<Metadata> => {
    const details = await getCommunityDetails();
    return {
        title: `Forum - ${details.name}`,
        description: `Forum homepage for ${details.name}. ${details.description}`,
    };
}

const ForumHomePage = async () => {
    const details = await getCommunityDetails();

    const user_token = await getStoredCookie("token");
    const personal_user = await getPersonalUser(user_token);

    return (
        <>
            <Header personal_user={personal_user} community_details={details} />
            <ForumContainer>
                <ForumHeader community_details={details} />
                <ForumContent>
                    <ForumSections />
                    <ForumInfo personal_user={personal_user} community_details={details} />
                </ForumContent>
            </ForumContainer>
            <Footer community_details={details} />
        </>
    );
}

export default ForumHomePage;