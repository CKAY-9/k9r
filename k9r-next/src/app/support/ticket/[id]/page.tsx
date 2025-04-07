import { getCommunityDetails } from "@/api/community-details/api";
import { getSupportTicket } from "@/api/support/api";
import { getPersonalUser } from "@/api/users/api";
import Footer from "@/components/footer/footer";
import Header from "@/components/header/header";
import { getAnyToken } from "@/utils/token";
import { Metadata } from "next";
import Link from "next/link";
import SupportTicketClient from "./client";

export const generateMetadata = async ({
	params,
}: {
	params: Promise<{
		id: string;
	}>;
}): Promise<Metadata> => {
    const details = await getCommunityDetails();
    const { id } = await params;
    const token = await getAnyToken();
    const ticket = await getSupportTicket(Number.parseInt(id), token);

    if (!ticket) {
        return {
            title: `Invalid Support Ticket - ${details.name}`,
            description: `Failed to find specified support ticket. ${details.description}`,
        };
    }
    
    return {
        title: `${ticket.issue_title} - ${details.name}`,
        description: `Create a new support ticket to the staff of ${details.name}. ${details.description}`,
    };
}

const SupportTicketPage = async () => {
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
                    <>
                        <SupportTicketClient community_details={details} personal_user={personal_user} />
                    </>
                )}
            </main>
            <Footer community_details={details} />
        </>
	);
}

export default SupportTicketPage;