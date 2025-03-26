import { getCommunityDetails } from "@/api/community-details/api";
import { getForumTopicFromID } from "@/api/forum/api";
import { getPersonalUser } from "@/api/users/api";
import Footer from "@/components/footer/footer";
import Header from "@/components/header/header";
import { getStoredCookie } from "@/utils/stored-cookies";
import { Metadata } from "next";
import { redirect } from "next/navigation";
import NewForumThreadClient from "./client";
import ForumContainer from "@/components/forum/container/forum-container";
import ForumHeader from "@/components/forum/header/forum-header";

export const generateMetadata = async ({
	params,
}: {
	params: {
		id: string;
	};
}): Promise<Metadata> => {
	const details = await getCommunityDetails();
	await params;

	return {
		title: `New Thread - ${details.name}`,
	};
};

const NewForumThreadPage = async ({
	params,
}: {
	params: {
		id: string;
	};
}) => {
	const details = await getCommunityDetails();

	const user_token = await getStoredCookie("token");
	const personal_user = await getPersonalUser(user_token);

	const { id } = await params;
	const topic = await getForumTopicFromID(Number.parseInt(id) || 0);

	if (personal_user === null) {
		redirect("/user/login");
	}

	return (
		<>
			<Header community_details={details} personal_user={personal_user} />
            <ForumContainer>
                <ForumHeader community_details={details} />
				<NewForumThreadClient
					personal_user={personal_user}
					community_details={details}
					forum_topic={topic}
				/>
            </ForumContainer>
			<Footer community_details={details} />
		</>
	);
};

export default NewForumThreadPage;
