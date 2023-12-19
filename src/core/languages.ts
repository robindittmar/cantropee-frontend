import type {Ref} from "vue";
import {ref} from "vue";

export interface Translation {
    welcomeText: string;
    expandHelp: string;
    explainGeneralPurpose: string;
    explainOrganizations: string;
    registerAccount: string;
    passwordTooShort: string;
    organization: string;
    organizations: string;
    user: string;
    nextStep: string;
    previousStep: string;
    confirmValuesRegistration: string;
    joinCantropee: string;

    settingsSaved: string;
    login: string;
    email: string;
    password: string;
    confirmPassword: string;
    keepLoggedIn: string;
    haveAnInvite: string;
    resetPassword: string;
    emailIsInvalid: string;
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
        expandHelp: 'Learn more...',
        explainGeneralPurpose: 'Cantropee is an application to track money flow and visualize your spendings, providing helpful insights.',
        explainOrganizations: 'An "organization" in Cantropee is like your usual bank account, except it does not contain any actual money. All transactions are only visible within the application and do not affect your earnings or any of your bank accounts. You will need to create an organization on sign-up, and after you are logged in you may create as many organizations as you like. Additionally you may add family and friends to your organizations, so you can collaboratively track spendings.',
        registerAccount: 'Register now',
        passwordTooShort: 'The password must be at least 6 characters long',
        organization: 'Organization',
        organizations: 'Organizations',
        user: 'User account',
        nextStep: 'Next',
        previousStep: 'Back',
        confirmValuesRegistration: 'Confirm your registration',
        joinCantropee: 'Join now',
        settingsSaved: 'Settings saved',
        login: 'Login',
        email: 'E-Mail',
        password: 'Password',
        confirmPassword: 'Confirm password',
        keepLoggedIn: 'Keep me logged in',
        haveAnInvite: 'I have an invite',
        resetPassword: 'Reset password',
        emailIsInvalid: 'The email you provided is invalid',
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
        trackTaxes: 'Company organization (track VAT for transactions)',
        addNewOrganization: 'Add new',
        addUserToOrganization: 'Add user',
        newOrganizationTitle: 'New Organization',
        currency: 'Currency',
    },
    'de-de': {
        welcomeText: 'Willkommen bei Cantropee!',
        expandHelp: 'Mehr erfahren...',
        explainGeneralPurpose: 'Cantropee ist eine Anwendung welche Einnahmen und Ausgaben visualisiert, um einfache Rückblicke und hilfreiche Prognosen zu ermöglichen.',
        explainOrganizations: 'Eine "Organisation" in Cantropee ist wie ein gewöhnliches Bankkonto, außer dass es keinen echten Gegenwert repräsentiert. Jede Buchung/Transaktion ist nur in Cantropee sichtbar und beeinflusst keines deiner Bankkonten. Bei der Anmeldung musst du direkt eine Organisation erstellen, und sobald du angemeldet bist kannst du beliebig viele zusätzliche Organisationen anlegen. Außerdem kannst du auch Famile und Freunde zu deinen Organisationen hinzufügen, um gemeinsam den Überblick zu behalten.',
        registerAccount: 'Registrieren',
        passwordTooShort: 'Das Passwort muss mindestens 6 Zeichen lang sein',
        organization: 'Organisation',
        organizations: 'Organisationen',
        user: 'Nutzer Konto',
        nextStep: 'Weiter',
        previousStep: 'Zurück',
        confirmValuesRegistration: 'Bestätige deine Registrierung',
        joinCantropee: 'Jetzt beitreten',
        settingsSaved: 'Einstellungen gespeichert',
        login: 'Anmelden',
        email: 'E-Mail',
        password: 'Passwort',
        confirmPassword: 'Passwort bestätigen',
        keepLoggedIn: 'Angemeldet bleiben',
        haveAnInvite: 'Ich habe eine Einladung',
        resetPassword: 'Password zurücksetzen',
        emailIsInvalid: 'Die eingegebene E-Mail Adresse ist nicht gültig',
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
        trackTaxes: 'Firmen Organisation (MwSt an Transaktionen erfassen)',
        addNewOrganization: 'Hinzufügen',
        addUserToOrganization: 'Nutzer hinzufügen',
        newOrganizationTitle: 'Neue Organisation',
        currency: 'Währung',
    },
};

export const availableLangCodes = ['en-us', 'de-de'];
export const availableLocaleCodes = ['en-us', 'en-ca', 'de-de'];
export const langCode: Ref<string> = ref(localStorage.getItem('lang') ?? availableLangCodes[0]);
export const localeCode: Ref<string> = ref(availableLocaleCodes[0]);
export const lang: Ref<Translation> = ref(languages[langCode.value]);
