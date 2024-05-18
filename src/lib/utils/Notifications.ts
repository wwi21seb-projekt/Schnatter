import { serverURL, token } from "$lib/Store";
import { get } from "svelte/store";


export async function deleteNotificationRequest(notificationId: string):Promise<boolean>{

     const response = await fetch(`${get(serverURL)}/notifications/${notificationId}`, {
        method: 'DELETE',
        headers: {
            'Authorization': `Bearer ${get(token)}`
        }
    })
    if (response.status === 200) {
        return true;
    } else {
        return false;
    }
}