import type {Ref} from "vue";
import {ref} from "vue";

export interface Translation {
    settingsSaved: string;
    login: string;
    email: string;
    password: string;
    confirmPassword: string;
    keepLoggedIn: string;
    haveAnInvite: string;
    resetPassword: string;
    new: string;
    save: string;
    cancel: string;

    userSettings: string;
    privateModeActiveOnLoad: string;
    previewActiveOnLoad: string;
    sortingAscendingOnLoad: string;

    invite: string;
    createInvite: string;

    validUntil: string;
    deposit: string;
    withdraw: string;

    unnamed: string;

    category: string;
    categoryCreatedSuccess: string;
    categoryUpdatedSuccess: string;
    categoryDeletedSuccess: string;
}

export const languages: {[languageCode: string]: Translation} = {
    'en-US': {
        settingsSaved: 'Settings saved',
        login: 'Login',
        email: 'E-Mail',
        password: 'Password',
        confirmPassword: 'Confirm password',
        keepLoggedIn: 'Keep logged in',
        haveAnInvite: 'I have an invite',
        resetPassword: 'Reset password',
        new: 'New',
        save: 'Save',
        cancel: 'Cancel',
        userSettings: 'User settings',
        privateModeActiveOnLoad: 'Private mode active by default',
        previewActiveOnLoad: 'Preview active by default',
        sortingAscendingOnLoad: 'Sort ascending by default',
        invite: 'Invite',
        createInvite: 'Create invite',
        validUntil: 'Valid until',
        deposit: 'Deposit',
        withdraw: 'Withdraw',
        unnamed: 'Unnamed',
        category: 'Category',
        categoryCreatedSuccess: 'Category created successfully',
        categoryUpdatedSuccess: 'Category saved successfully',
        categoryDeletedSuccess: 'Category deleted successfully',
    },
    'de-DE': {
        settingsSaved: 'Einstellungen gespeichert',
        login: 'Anmelden',
        email: 'E-Mail',
        password: 'Passwort',
        confirmPassword: 'Passwort bestätigen',
        keepLoggedIn: 'Angemeldet bleiben',
        haveAnInvite: 'Ich habe eine Einladung',
        resetPassword: 'Password zurücksetzen',
        new: 'Neu',
        save: 'Speichern',
        cancel: 'Abbrechen',
        userSettings: 'Nutzer Einstellungen',
        privateModeActiveOnLoad: 'Privater Modus aktiv wenn Seite geladen wird',
        previewActiveOnLoad: '"Vorschau" aktiv wenn Seite geladen wird',
        sortingAscendingOnLoad: 'Sortierung aufsteigend wenn Seite geladen wird',
        invite: 'Einladung',
        createInvite: 'Einladung erstellen',
        validUntil: 'Gültig bis',
        deposit: 'Einzahlen',
        withdraw: 'Auszahlen',
        unnamed: 'Unbenannt',
        category: 'Kategorie',
        categoryCreatedSuccess: 'Kategorie erfolgreich erstellt',
        categoryUpdatedSuccess: 'Kategorie erfolgreich gespeichert',
        categoryDeletedSuccess: 'Kategorie erfolgreich gelöscht',
    },
};

export const lang: Ref<Translation> = ref(languages['en-US']);
