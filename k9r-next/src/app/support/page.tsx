import { getCommunityDetails } from "@/api/community-details/api";
import { getPersonalUser } from "@/api/users/api";
import Footer from "@/components/footer/footer";
import Header from "@/components/header/header";
import { getStoredCookie } from "@/utils/stored-cookies";
import { Metadata } from "next";
import SupportClient from "./client";
import Link from "next/link";

export const generateMetadata = async (): Promise<Metadata> => {
	const details = await getCommunityDetails();
	return {
		title: `Support - ${details.name}`,
		description: `Create new support tickets or view and reply to existing ones on ${details.name}. ${details.description}`,
	};
};

const SupportPage = async () => {
	const details = await getCommunityDetails();

	const user_token = await getStoredCookie("token");
	const personal_user = await getPersonalUser(user_token);

	return (
		<>
			<Header community_details={details} personal_user={personal_user} />
			<main className="container flex gap-1">
				{personal_user === null ? (
					<>
						<h1>Support</h1>
						<span>
							Support is only available to logged in users. Login{" "}
							<Link href="/user/login">here</Link>
						</span>
					</>
				) : (
					<SupportClient
						community_details={details}
						personal_user={personal_user}
					/>
				)}
			</main>
			<Footer community_details={details} />
		</>
	);
};

export default SupportPage;
