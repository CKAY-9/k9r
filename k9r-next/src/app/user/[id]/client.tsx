"use client";

import { CommunityDetails } from "@/api/community-details/models";
import { User } from "@/api/users/models";
import UserActivity from "@/components/user/activity/user-activity";
import UserContainer from "@/components/user/container/user-container";
import UserInfo from "@/components/user/user-info/user-info";
import { useEffect } from "react";

type UserProfileClientProps = {
    user: User;
    community_details: CommunityDetails;
}

const UserProfileClient = (props: UserProfileClientProps) => {
    useEffect(() => {
        if (typeof(document) === undefined) {
            return;
        }

        const body = document.body;
        if (body === null) {
            return;
        }

        if (props.user.banner.length >= 1) {
            body.style.backgroundColor = "var(--background)";
        }
    });

    return (
        <UserContainer user={props.user}>
            <>
                <UserInfo user={props.user} />
                <UserActivity user={props.user} />
            </>
        </UserContainer>
    );
}

export default UserProfileClient;