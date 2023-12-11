import {authorized} from "@/core/user";
import {toast, ToastColor} from "@/core/toaster";
import {lang} from "@/core/languages";


export async function req(input: RequestInfo | URL, init?: RequestInit): Promise<Response> {
    const result = await fetch(input, init);

    if (!result.ok) {
        const err = await result.json();

        if (result.status === 401) {
            authorized.value = false;
        } else if (result.status === 403) {
            toast(lang.value.insufficientPermission, ToastColor.Warning);
        } else {
            toast(err.message, ToastColor.Danger);
        }
    }

    return result;
}
