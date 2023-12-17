import type {Ref} from "vue";
import {ref} from "vue";

export interface Translation {
    welcomeText: string;
    expandHelp: string;
    explainGeneralPurpose: string;
    explainOrganizations: string;
    registerAccountTitle: string;
    organizations: string;

    settingsSaved: string;
    login: string;
    email: string;
    password: string;
    confirmPassword: string;
    keepLoggedIn: string;
    haveAnInvite: string;
    resetPassword: string;
    passwordsDoNotMatch: string;
    timezone: string;

    all: string;
    search: string;
    add: string;
    new: string;
    edit: string;
    save: string;
    create: string;
    delete: string;
    cancel: string;
    check: string;
    confirm: string;
    confirmDelete: string;
    bookAction: string;

    name: string;
    readPriv: string;
    writePriv: string;
    adminPriv: string;

    anErrorHasOccured: string;
    insufficientPermission: string;

    history: string;
    autoGenerated: string;

    userSettings: string;
    languageSetting: string;
    localeSetting: string;
    privateModeActiveOnLoad: string;
    previewActiveOnLoad: string;
    sortingAscendingOnLoad: string;

    preview: string;
    ascending: string;
    descending: string;

    invite: string;
    createInvite: string;
    inviteIsValid: string;
    inviteIsInvalid: string;
    inviteSuccess: string;

    copyToClipboardSuccess: string;
    copyToClipboardFailure: string;

    validUntil: string;
    deposit: string;
    depositTitle: string;
    withdraw: string;
    withdrawalTitle: string;

    unnamed: string;

    creationDate: string;
    bookingDate: string;
    value: string;
    value19: string;
    value7: string;
    vat19: string;
    vat7: string;
    note: string;
    transactionType: string;

    recurringPayment: string;
    recurringPayments: string;
    recurringExecutionStrategy: string;
    startOfMonth: string;
    endOfMonth: string;
    firstExecution: string;
    nextExecution: string;
    lastExecution: string;

    firstExecutionIsInvalidDate: string;
    lastExecutionIsInvalidDate: string;

    recurringDeleteTransactionsCascasing: string;

    users: string;
    role: string;
    roles: string;
    roleCreatedSuccess: string;
    roleUpdatedSuccess: string;
    roleDeletedSuccess: string;

    category: string;
    categories: string;
    categoryCreatedSuccess: string;
    categoryUpdatedSuccess: string;
    categoryDeletedSuccess: string;

    nameOfOrg: string;
    trackTaxes: string;

    addNewOrganization: string;
    addUserToOrganization: string;
    newOrganizationTitle: string;
    currency: string;
}

export const languages: {[languageCode: string]: Translation} = {
    'en-us': {
        welcomeText: 'Welcome to Cantropee!',
        expandHelp: 'Explain to me what Cantropee is!',
        explainGeneralPurpose: 'Cantropee is an application to track money flow and visualize your spendings, giving helpful insights.',
        explainOrganizations: 'An "organization" is like your usual bank account. Each transaction is attached to an organization. Once logged in you may create as many organizations as you like and also add family/friends to them, so you can collaboratively track spendings.',
        registerAccountTitle: 'Register your account',
        organizations: 'Organizations',
        settingsSaved: 'Settings saved',
        login: 'Login',
        email: 'E-Mail',
        password: 'Password',
        confirmPassword: 'Confirm password',
        keepLoggedIn: 'Keep me logged in',
        haveAnInvite: 'I have an invite',
        resetPassword: 'Reset password',
        passwordsDoNotMatch: 'The passwords do not match',
        timezone: 'Timezone',
        all: 'All',
        search: 'Search',
        add: 'Add',
        new: 'New',
        edit: 'Edit',
        save: 'Save',
        create: 'Create',
        delete: 'Delete',
        cancel: 'Cancel',
        check: 'Check',
        confirm: 'Confirm',
        confirmDelete: 'Confirm delete (I am really sure!)',
        bookAction: 'Book',
        name: 'Name',
        readPriv: 'Read',
        writePriv: 'Write',
        adminPriv: 'Admin',
        anErrorHasOccured: 'An error has occured',
        insufficientPermission: 'Insufficient permissions',
        history: 'History',
        autoGenerated: '<auto-generated>',
        userSettings: 'User settings',
        languageSetting: 'Language',
        localeSetting: 'Locale',
        privateModeActiveOnLoad: 'Private mode active by default',
        previewActiveOnLoad: 'Preview active by default',
        sortingAscendingOnLoad: 'Sort ascending by default',
        preview: 'Preview',
        ascending: 'Ascending',
        descending: 'Descending',
        invite: 'Invite',
        createInvite: 'Create invite',
        inviteIsValid: 'The invite is valid',
        inviteIsInvalid: 'The invite is not valid',
        inviteSuccess: 'Success! You may now login',
        copyToClipboardSuccess: 'Copied to clipboard',
        copyToClipboardFailure: 'Failed to copy to clipboard',
        validUntil: 'Valid until',
        deposit: 'Deposit',
        depositTitle: 'Deposit',
        withdraw: 'Withdraw',
        withdrawalTitle: 'Withdrawal',
        unnamed: 'Unnamed',
        creationDate: 'Creation date',
        bookingDate: 'Booking date',
        value: 'Value',
        value19: 'Value 19%',
        value7: 'Value 7%',
        vat19: 'VAT 19%',
        vat7: 'VAT 7%',
        note: 'Note',
        transactionType: 'Type',
        recurringPayment: 'Recurring payment',
        recurringPayments: 'Recurring payments',
        recurringExecutionStrategy: 'Execution strategy',
        startOfMonth: 'Start of month',
        endOfMonth: 'End of month',
        firstExecution: 'First execution',
        nextExecution: 'Next execution',
        lastExecution: 'Last execution',
        firstExecutionIsInvalidDate: '"First execution" is not a valid date',
        lastExecutionIsInvalidDate: '"Last execution" is not a valid date',
        recurringDeleteTransactionsCascasing: 'Delete all transactions belonging to this recurring payment, even if they lie in the past',
        users: 'Users',
        role: 'Role',
        roles: 'Roles',
        roleCreatedSuccess: 'Role created successfully',
        roleUpdatedSuccess: 'Role saved successfully',
        roleDeletedSuccess: 'Role deleted successfully',
        category: 'Category',
        categories: 'Categories',
        categoryCreatedSuccess: 'Category created successfully',
        categoryUpdatedSuccess: 'Category saved successfully',
        categoryDeletedSuccess: 'Category deleted successfully',
        nameOfOrg: 'Organization name',
        trackTaxes: 'Track VAT for transactions',
        addNewOrganization: 'Add new',
        addUserToOrganization: 'Add user',
        newOrganizationTitle: 'New Organization',
        currency: 'Currency',
    },
    'de-de': {
        welcomeText: 'Willkommen bei Cantropee!',
        expandHelp: 'Erklär mir was Cantropee ist!',
        explainGeneralPurpose: 'Cantropee ist eine Anwendung um Ein-/ und Ausgaben zu visualisieren, um einfache Rückblicke und hilfreiche Prognosen zu ermöglichen.',
        explainOrganizations: 'Eine "Organisation" ist wie ein gewöhnliches Bank-Konto. Jede Transaktion ist mit einem Konto verknüpft. Du kannst wenn du angemeldet bist beliebig viele Organisationen erstellen und auch Famile oder Freunde zu diesen hinzufügen, um gemeinsam den Überblick zu behalten.',
        registerAccountTitle: 'Registriere jetzt deinen Account',
        organizations: 'Organisationen',
        settingsSaved: 'Einstellungen gespeichert',
        login: 'Anmelden',
        email: 'E-Mail',
        password: 'Passwort',
        confirmPassword: 'Passwort bestätigen',
        keepLoggedIn: 'Angemeldet bleiben',
        haveAnInvite: 'Ich habe eine Einladung',
        resetPassword: 'Password zurücksetzen',
        passwordsDoNotMatch: 'Die Passwörter stimmen nicht überein',
        timezone: 'Zeitzone',
        all: 'Alle',
        search: 'Suchen',
        add: 'Hinzufügen',
        new: 'Neu',
        edit: 'Bearbeiten',
        save: 'Speichern',
        create: 'Erstellen',
        delete: 'Löschen',
        cancel: 'Abbrechen',
        check: 'Prüfen',
        confirm: 'Bestätigen',
        confirmDelete: 'Löschen bestätigen (Ich bin mir sicher!)',
        bookAction: 'Buchen',
        name: 'Name',
        readPriv: 'Lesen',
        writePriv: 'Schreiben',
        adminPriv: 'Admin',
        anErrorHasOccured: 'Ein Fehler ist aufgetreten',
        insufficientPermission: 'Rechte unzureichend',
        history: 'Historie',
        autoGenerated: '<auto-generiert>',
        userSettings: 'Nutzer Einstellungen',
        languageSetting: 'Sprache',
        localeSetting: 'Format',
        privateModeActiveOnLoad: 'Privater Modus aktiv wenn Seite geladen wird',
        previewActiveOnLoad: '"Vorschau" aktiv wenn Seite geladen wird',
        sortingAscendingOnLoad: 'Sortierung aufsteigend wenn Seite geladen wird',
        preview: 'Vorschau',
        ascending: 'Aufsteigend',
        descending: 'Absteigend',
        invite: 'Einladung',
        createInvite: 'Einladung erstellen',
        inviteIsValid: 'Die Einladung ist gültig',
        inviteIsInvalid: 'Die Einladung ist ungültig',
        inviteSuccess: 'Erfolgreich! Du kannst dich nun Anmelden',
        copyToClipboardSuccess: 'In Zwischenablage kopiert',
        copyToClipboardFailure: 'Konnte nicht in Zwischenablage kopiert werden',
        validUntil: 'Gültig bis',
        deposit: 'Einzahlen',
        depositTitle: 'Einzahlung',
        withdraw: 'Auszahlen',
        withdrawalTitle: 'Auszahlung',
        unnamed: 'Unbenannt',
        creationDate: 'Erstelldatum',
        bookingDate: 'Buchungsdatum',
        value: 'Betrag',
        value19: 'Betrag 19%',
        value7: 'Betrag 7%',
        vat19: 'MwSt 19%',
        vat7: 'MwSt 7%',
        note: 'Notiz',
        transactionType: 'Typ',
        recurringPayment: 'Dauerauftrag',
        recurringPayments: 'Daueraufträge',
        recurringExecutionStrategy: 'Ausführungs Strategie',
        startOfMonth: 'Anfang des Monats',
        endOfMonth: 'Ende des Monats',
        firstExecution: 'Erste Ausführung',
        nextExecution: 'Nächste Ausführung',
        lastExecution: 'Letzte Ausführung',
        firstExecutionIsInvalidDate: '"Erste Ausführung" ist kein gültiges Datum',
        lastExecutionIsInvalidDate: '"Letzte Ausführung" ist kein gültiges Datum',
        recurringDeleteTransactionsCascasing: 'Alle Transaktionen dieses Dauerauftrags löschen, auch wenn diese in der Vergangenheit liegen',
        users: 'Benutzer',
        role: 'Rolle',
        roles: 'Rollen',
        roleCreatedSuccess: 'Rolle erfolgreich erstellt',
        roleUpdatedSuccess: 'Rolle erfolgreich gespeichert',
        roleDeletedSuccess: 'Rolle erfolgreich gelöscht',
        category: 'Kategorie',
        categories: 'Kategorien',
        categoryCreatedSuccess: 'Kategorie erfolgreich erstellt',
        categoryUpdatedSuccess: 'Kategorie erfolgreich gespeichert',
        categoryDeletedSuccess: 'Kategorie erfolgreich gelöscht',
        nameOfOrg: 'Name des Kontos',
        trackTaxes: 'MwSt bei Transaktionen erfassen',
        addNewOrganization: 'Hinzufügen',
        addUserToOrganization: 'Nutzer hinzufügen',
        newOrganizationTitle: 'Neue Organisation',
        currency: 'Währung',
    },
};

export const availableLangCodes = ['en-us', 'de-de'];
export const availableLocaleCodes = ['en-us', 'en-ca', 'de-de'];
export const langCode: Ref<string> = ref(availableLangCodes[0]);
export const localeCode: Ref<string> = ref(availableLocaleCodes[0]);
export const lang: Ref<Translation> = ref(languages[langCode.value]);
