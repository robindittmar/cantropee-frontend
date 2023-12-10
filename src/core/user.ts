import type {Organization} from "./organization";
import type {Ref} from "vue";
import {ref} from "vue";
import {req} from "@/core/requests";

export interface User {
    id: string;
    email: string;
    settings: UserSettings;
    organizations: Organization[];
    currentOrganization: Organization | undefined;
}

export interface UserSettings {
    defaultOrganization: string;
    canCreateInvite: boolean;
    privateMode: boolean;
    defaultPreviewPending: boolean;
    defaultSortingOrderAsc: boolean;
    extra: object | null;
}

export const authorized: Ref<boolean> = ref(false);

export function defaultUser(): User {
    return {
        id: '',
        email: '',
        settings: {
            defaultOrganization: '',
            canCreateInvite: false,
            privateMode: true,
            defaultPreviewPending: false,
            defaultSortingOrderAsc: false,
            extra: null,
        },
        organizations: [],
        currentOrganization: undefined,
    };
}

export async function fetchUser(): Promise<User> {
    const result = await req('/api/users/me');
    if (!result.ok) {
        if (result.status === 401) {
            throw new Error('Unauthorized');
        }
    }
    return await result.json();
}

export async function updateUserSettings(userSettings: UserSettings): Promise<boolean> {
    const result = await req('/api/users/me/settings', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(userSettings),
    });

    return result.ok;
}
