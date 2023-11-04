export const valueToString = (value: number) => {
    return (value / 100).toLocaleString(undefined, {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
    });
};

export const moneyToString = (value: number, currency: string) => {
    return `${currency} ${valueToString(value)}`;
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
    try {
        return new Date(dt.getTime() - (dt.getTimezoneOffset() * 60000)).toISOString().slice(0, 16);
    } catch {
        return;
    }
};
