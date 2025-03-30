"use server";

import { getCommunityDetails } from "@/api/community-details/api";
import { getPersonalUser, getUserFromID } from "@/api/users/api";
import Footer from "@/components/footer/footer";
import Header from "@/components/header/header";
import { getStoredCookie } from "@/utils/stored-cookies";
import { Metadata } from "next";
import UserProfileClient from "./client";

export const generateMetadata = async ({ params }: {
    params: Promise<{
        id: string
    }>
}): Promise<Metadata> => {
    const details = await getCommunityDetails();

    const { id } = await params;
    const user = await getUserFromID(Number.parseInt(id));

    if (user === null) {
        return {
            title: `Invalid User - ${details.name}`,
            description: `Failed to find user with specified ID on ${details.name}. ${details.description}`
        }
    }

    return {
        title: `${user.display_name}'s Profile - ${details.name}`,
        description: `${user.display_name}'s profile on ${details.name}. ${details.description}`,
    };
}

const UserPage = async ({ params }: {
    params: Promise<{
        id: string
    }>
}) => {
    const details = await getCommunityDetails();

    const user_token = await getStoredCookie("token");
    const personal_user = await getPersonalUser(user_token);

    const { id } = await params;
    const user = await getUserFromID(Number.parseInt(id));
    
    return (
        <>
            <Header community_details={details} personal_user={personal_user} />
            <main className="container">
                {user === null ? (
                    <h1>Failed to find user with specified ID</h1>
                ) : (
                    <UserProfileClient user={user} community_details={details} />
                )}
            </main>
            <Footer community_details={details} />
        </>
    );
}

export default UserPage;