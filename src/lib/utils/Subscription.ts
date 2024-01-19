import { serverURL } from "$lib/Store";
import type { Subscriptions } from "$lib/types/Subscriptions";
import { get } from "svelte/store";

export async function getSubscriptions(token: string, type: string, offset: number, limit: number) {
    let data:Subscriptions = {
        records: [],
        pagination: {
            limit: 0,
            offset: 0
        }
    }
    const params = new URLSearchParams({
        type: type,
        offset: offset.toString(),
        limit: limit.toString(),
    });

    const url = get(serverURL) + "/subscriptions?" + params;

    const response = await fetch(url, {
        method: "GET",
        mode: "cors",
        headers: {
            "Authorization": "Bearer " + token,
            "Content-Type": "application/json",
        },

    });

    if (response.status === 200) {
        data = await response.json();
    
    }
    return data;
    



}