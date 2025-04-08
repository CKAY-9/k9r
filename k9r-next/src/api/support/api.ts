import axios from "axios";
import { SupportTicket, SupportTicketReply } from "./models";
import { K9R_API } from "../resources";

export const getAllSupportTickets = async (
	token: string
): Promise<SupportTicket[]> => {
	try {
		const request = await axios({
			url: `${K9R_API}/support/ticket/all`,
			method: "GET",
			headers: {
				Authorization: token,
			},
		});
		return request.data;
	} catch {
		return [];
	}
};

export const getSupportTicket = async (
	support_ticket_id: number,
	token: string
): Promise<SupportTicket | null> => {
	try {
		const request = await axios({
			url: `${K9R_API}/support/ticket/${support_ticket_id}`,
			method: "GET",
			headers: {
				Authorization: token,
			},
		});
		return request.data;
	} catch {
		return null;
	}
};

export const getSupportTicketReplies = async (
	support_ticket_id: number,
	token: string
): Promise<SupportTicketReply[]> => {
	try {
		const request = await axios({
			url: `${K9R_API}/support/ticket/${support_ticket_id}/replies`,
			method: "GET",
			headers: {
				Authorization: token,
			},
		});
		return request.data;
	} catch {
		return [];
	}
};

export const getMySupportTickets = async (
	token: string
): Promise<SupportTicket[]> => {
	try {
		const request = await axios({
			url: `${K9R_API}/support/ticket/mine`,
			method: "GET",
			headers: {
				Authorization: token,
			},
		});
		return request.data;
	} catch {
		return [];
	}
};

export const createNewSupportTicket = async (
	support_ticket: SupportTicket,
	token: string
): Promise<SupportTicket | null> => {
	try {
		const request = await axios({
			url: `${K9R_API}/support/ticket`,
			method: "POST",
			data: support_ticket,
			headers: {
				Authorization: token,
			},
		});
		return request.data;
	} catch {
		return null;
	}
};

export const createNewSupportTicketReply = async (
	support_ticket_id: number,
	reply: SupportTicketReply,
	token: string
): Promise<SupportTicketReply | null> => {
	try {
		const request = await axios({
			url: `${K9R_API}/support/ticket/${support_ticket_id}/reply`,
			method: "POST",
			data: reply,
			headers: {
				Authorization: token,
			},
		});
		return request.data;
	} catch {
		return null;
	}
};

export const toggleSupportTicketCompleted = async (
	support_ticket_id: number,
	token: string
): Promise<SupportTicket | null> => {
	try {
		const request = await axios({
			url: `${K9R_API}/support/ticket/${support_ticket_id}/completed`,
			method: "PUT",
			headers: {
				Authorization: token
			}
		});
		return request.data;	
	} catch {
		return null;
	}
} 