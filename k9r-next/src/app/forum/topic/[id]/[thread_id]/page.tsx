import { getCommunityDetails } from "@/api/community-details/api";
import { getForumThreadFromID, getForumTopicFromID } from "@/api/forum/api";
import { getPersonalUser } from "@/api/users/api";
import Footer from "@/components/footer/footer";
import ForumContainer from "@/components/forum/container/forum-container";
import ForumHeader from "@/components/forum/header/forum-header";
import Thread from "@/components/forum/threads/forum-thread";
import Header from "@/components/header/header";
import { getStoredCookie } from "@/utils/stored-cookies";
import { Metadata } from "next";

export const generateMetadata = async ({
	params,
}: {
	params: {
		id: string;
		thread_id: string;
	};
}): Promise<Metadata> => {
    const details = await getCommunityDetails();
    
    const { id, thread_id } = await params;
    const topic = await getForumTopicFromID(Number.parseInt(id) || 0);
    const thread = await getForumThreadFromID(Number.parseInt(thread_id) || 0);

	if (topic !== null && thread !== null) {
		return {
			title: `${thread.title} - ${details.name}`,
			description: `View the thread ${thread.title} in the ${topic.name} topic on ${details.name}. ${details.description}`
		}
	}

	return {
		title: `Invalid Thread - ${details.name}`,
		description: `Failed to get specified thread on ${details.name}. ${details.description}`
	}
};

const ThreadPage = async ({
	params,
}: {
	params: {
		id: string;
		thread_id: string;
	};
}) => {
    const details = await getCommunityDetails();
    
    const { id, thread_id } = await params;
    const topic = await getForumTopicFromID(Number.parseInt(id) || 0);
    const thread = await getForumThreadFromID(Number.parseInt(thread_id) || 0);

	const user_token = await getStoredCookie("token");
	const personal_user = await getPersonalUser(user_token);

	return (
		<>
			<Header community_details={details} personal_user={personal_user} />
            <ForumContainer>
                <ForumHeader community_details={details} />
				{(thread !== null && topic !== null) ? (
					<Thread 
						community_details={details}
						personal_user={personal_user}
						topic={topic}
						thread={thread}
					/>
				) : (
					<span>Failed to get thread/topic.</span>
				)}
            </ForumContainer>
			<Footer community_details={details} />
		</>
	);
};

export default ThreadPage;
