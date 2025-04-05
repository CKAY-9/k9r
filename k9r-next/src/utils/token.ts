import { getCookie } from "./cookies";
import { getStoredCookie } from "./stored-cookies";

export const getAnyToken = async (): Promise<string> => {
	const stored_token = await getStoredCookie("token");
	const client_token =
		typeof document !== "undefined" ? getCookie("token") : "";
	const token = stored_token || client_token || "";
    return token;
};
