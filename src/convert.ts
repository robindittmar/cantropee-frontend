import {Money} from "ts-money";

export const moneyToString = (m: Money) => {
    if (m === undefined) {
        return '';
    }

    return `${m.getCurrency()} ${m.toString()}`;
};

export const dateToURI = (dt: Date) => {
    return encodeURI(dt.toISOString());
};

export const dateToString = (dt: Date) => {
    if (dt === undefined)
        return '';

    return dt.toLocaleString('de-DE', {
        weekday: 'short',
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
    });
}

export const convertLocalDateForInput = (dt: Date) => {
    return new Date(dt.getTime() - (dt.getTimezoneOffset() * 60000)).toISOString().slice(0, 16);
};
