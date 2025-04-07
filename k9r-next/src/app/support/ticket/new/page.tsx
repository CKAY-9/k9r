import { getCommunityDetails } from "@/api/community-details/api";
import { getPersonalUser } from "@/api/users/api";
import Footer from "@/components/footer/footer";
import Header from "@/components/header/header";
import { getAnyToken } from "@/utils/token";
import { Metadata } from "next";
import Link from "next/link";
import NewSupportTicketClient from "./client";

export const generateMetadata = async (): Promise<Metadata> => {
    const details = await getCommunityDetails();
    return {
        title: `New Support Ticket - ${details.name}`,
        description: `Create a new support ticket to the staff of ${details.name}. ${details.description}`,
    };
}

const NewSupportTicketPage = async () => {
    const details = await getCommunityDetails();

	const user_token = await getAnyToken();
	const personal_user = await getPersonalUser(user_token);

	return (
		<>
			<Header community_details={details} personal_user={personal_user} />
            <main className="container" style={{"gap": "1rem"}}>
                {personal_user === null ? (
                    <>
                        <h1>Support</h1>
                        <span>Support is only available to logged in users. Login <Link href="/user/login">here</Link></span>
                    </>
                ) : (
                    <NewSupportTicketClient personal_user={personal_user} />
                )}
            </main>
            <Footer community_details={details} />
        </>
	);
}

export default NewSupportTicketPage;