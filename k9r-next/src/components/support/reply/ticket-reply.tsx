import { SupportTicketReply } from "@/api/support/models";
import style from "./reply.module.scss";
import { useEffect, useState } from "react";
import { User } from "@/api/users/models";
import { getUserFromID } from "@/api/users/api";
import UserTab from "@/components/user/user-tab/user-tab";

type TicketReplyProps = {
	support_ticket_reply: SupportTicketReply;
};

const TicketReply = (props: TicketReplyProps) => {
	const [user, setUser] = useState<User | null>(null);

	useEffect(() => {
		(async () => {
			setUser(await getUserFromID(props.support_ticket_reply.user_id));
		})();
	}, [props.support_ticket_reply.user_id]);

	return (
		<div className={style.reply}>
			<p>{props.support_ticket_reply.message}</p>
			<section className={`flex row gap-1 align`}>
                {user && <UserTab user={user} />}
                <span style={{"opacity": "0.5"}}>Posted {new Date(props.support_ticket_reply.created).toLocaleString()}</span>
            </section>
		</div>
	);
};

export default TicketReply;
