import type {Organization} from "./organization";

export interface User {
    id: string;
    email: string;
    settings: UserSettings;
    organizations: Organization[];
    currentOrganizationId: string;
    currentOrg: Organization | undefined;
}

export interface UserSettings {
    defaultOrganization: string;
    privateMode: boolean;
    defaultPreviewPending: boolean;
    defaultSortingOrderAsc: boolean;
    extra: object | null;
}

export function defaultUser(): User {
    return {
        id: '',
        email: '',
        settings: {
            defaultOrganization: '',
            privateMode: true,
            defaultPreviewPending: false,
            defaultSortingOrderAsc: false,
            extra: null,
        },
        organizations: [],
        currentOrganizationId: '',
        currentOrg: undefined,
    };
}

export async function fetchUser(): Promise<User> {
    const user: User = await (await fetch('/api/users/me')).json();
    user.currentOrg = user.organizations.find(o => o.id === user.currentOrganizationId) ?? user.organizations[0];
    return user;
}

export async function updateUserSettings(userSettings: UserSettings): Promise<boolean> {
    const result = await fetch('/api/users/me/settings', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(userSettings),
    });

    return result.ok;
}
