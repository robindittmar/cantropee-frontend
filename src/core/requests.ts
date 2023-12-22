import {authorized} from "@/core/user";


export async function req(input: RequestInfo | URL, init?: RequestInit): Promise<Response> {
    const result = await fetch(input, init);

    if (!result.ok) {
        if (result.status === 401) {
            authorized.value = false;
        }
    }

    return result;
}
