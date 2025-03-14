"use server";

import { cookies } from "next/headers"

export const getStoredCookie = async (cookie_key: string): Promise<string> => {
    const cookie_storage = await cookies()
    const cookie = cookie_storage.get(cookie_key)?.value;
    if (cookie === undefined)
        return "";
    return cookie;
}