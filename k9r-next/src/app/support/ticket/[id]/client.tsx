"use client";

import { CommunityDetails } from "@/api/community-details/models";
import { User } from "@/api/users/models";
import SupportHeader from "@/components/support/support-header/support-header";

type TicketClientProps = {
    personal_user: User;
	community_details: CommunityDetails;
};

const SupportTicketClient = (props: TicketClientProps) => {
	return (
		<>
			<SupportHeader
				community_details={props.community_details}
				redirect_on_tab={true}
				personal_user={props.personal_user}
			/>
		</>
	);
};

export default SupportTicketClient;