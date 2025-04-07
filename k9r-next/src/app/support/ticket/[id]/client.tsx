"use client";

import { User } from "@/api/users/models";
import SupportHeader from "@/components/support/support-header/support-header";

type TicketClientProps = {
    personal_user: User;
};

const SupportTicketClient = (props: TicketClientProps) => {
	return (
		<>
			<SupportHeader
				change_view={(_) => (window.location.href = "/support")}
				personal_user={props.personal_user}
			/>
		</>
	);
};

export default SupportTicketClient;