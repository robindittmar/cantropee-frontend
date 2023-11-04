import {authorized} from "@/core/user";
import {toast, ToastColor} from "@/core/toaster";


export async function req(input: RequestInfo | URL, init?: RequestInit): Promise<Response> {
    const result = await fetch(input, init);

    if (!result.ok) {
        if (result.status === 401) {
            authorized.value = false;
            throw new Error('Unauthorized');
        } else if (result.status === 403) {
            toast('Rechte unzureichend', ToastColor.Warning);
        } else if (result.status === 500) {
            toast('Server Fehler', ToastColor.Danger);
        }
    }

    return result;
}
