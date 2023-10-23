
export interface UserSettings {
    defaultOrganization: string;
    privateMode: boolean;
}

export function defaultUserSettings(): UserSettings {
    return {
        defaultOrganization: '',
        privateMode: true,
    };
}

export async function fetchUserSettings(): Promise<UserSettings> {
    return await (await fetch('/api/users/me/settings')).json();
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
