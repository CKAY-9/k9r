import { CommunityDetails } from "@/api/community-details/models";
import { User } from "@/api/users/models";
import UserContainer from "@/components/user/container/user-container";
import UserInfo from "@/components/user/user-info/user-info";

type UserProfileClientProps = {
    user: User;
    community_details: CommunityDetails;
}

const UserProfileClient = (props: UserProfileClientProps) => {
    return (
        <UserContainer user={props.user}>
            <>
                <UserInfo user={props.user} />
            </>
        </UserContainer>
    );
}

export default UserProfileClient;