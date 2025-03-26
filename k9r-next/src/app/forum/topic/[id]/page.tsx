"use server";

import { getCommunityDetails } from "@/api/community-details/api";
import { getPersonalUser } from "@/api/users/api";
import Footer from "@/components/footer/footer";
import ForumContainer from "@/components/forum/container/forum-container";
import ForumHeader from "@/components/forum/header/forum-header";
import Header from "@/components/header/header";
import { getStoredCookie } from "@/utils/stored-cookies";
import { getForumTopicFromID } from "@/api/forum/api";
import { Metadata } from "next";
import Topic from "@/components/forum/topics/forum-topic";

export const generateMetadata = async ({
	params,
}: {
	params: {
		id: string;
	};
}): Promise<Metadata> => {
	const details = await getCommunityDetails();

	const { id } = await params;
	const topic = await getForumTopicFromID(Number.parseInt(id) || 0);

    if (topic !== null) {
        return {
            title: `${topic.name} - ${details.name}`,
            description: `View the ${topic.name} topic on ${details.name}. ${topic.description}. ${details.description}`
        };
    }

    return {
        title: `Invalid Thread - ${details.name}`,
        description: `Failed to find specific thread with this ID. ${details.description}`
    };
};

const TopicPage = async ({
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

	return (
		<>
			<Header personal_user={personal_user} community_details={details} />
			<ForumContainer>
				<ForumHeader community_details={details} />
				{topic === null ? (
					<span>Failed to get topic.</span>
				) : (
					<Topic forum_topic={topic} personal_user={personal_user} />
				)}
			</ForumContainer>
			<Footer community_details={details} />
		</>
	);
};

export default TopicPage;
