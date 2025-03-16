import { getCommunityDetails } from "@/api/community-details/api";
import { getPersonalUser } from "@/api/users/api";
import Footer from "@/components/footer/footer";
import Header from "@/components/header/header";
import { getStoredCookie } from "@/utils/stored-cookies";
import { Metadata } from "next";
import SearchThreadsClient from "./client";

export const generateMetadata = async (): Promise<Metadata> => {
    const details = await getCommunityDetails();
    return {
        title: `Search Threads - ${details.name}`,
        description: `Search all threads that are on ${details.name}. ${details.description}`,
    };
}

const ThreadSearchPage = async () => {
    const details = await getCommunityDetails();

    const user_token = await getStoredCookie("token");
    const personal_user = await getPersonalUser(user_token);

    return (
        <>
            <Header personal_user={personal_user} community_details={details} />
            <main className="container" style={{"gap": "1rem"}}>
                <SearchThreadsClient />
            </main>
            <Footer community_details={details} />
        </>
    );
}

export default ThreadSearchPage;