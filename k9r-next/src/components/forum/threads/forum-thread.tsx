"use client";

import { CommunityDetails } from "@/api/community-details/models";
import { ForumPost, ForumThread, ForumTopic } from "@/api/forum/models";
import { User } from "@/api/users/models";

type ThreadProps = {
    community_details: CommunityDetails;
    personal_user: User | null;
    topic: ForumTopic;
    thread: ForumThread;
    posts?: ForumPost[];
};

const Thread = (props: ThreadProps) => {
    return (
        <>
        </>
    );
}

export default Thread;