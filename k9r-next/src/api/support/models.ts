export type SupportTicket = {
	id: number;
	status: number;
	created: string;
	updated: string;
	creator: number;
	issue_title: string;
	issue_topic: string;
	issue_description: string;
	involved_users: number[];
	file_attachments: string[];
};

export type SupportTicketReply = {
	id: number;
	created: string;
	support_ticket: number;
	user_id: number;
	message: string;
	file_attachments: string[];
};
