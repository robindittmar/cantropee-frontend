export interface Balance {
    total: number;
    vat: {
        total: number;
        vat19: number;
        vat7: number;
    },
    pending: {
        total: number;
        vat: {
            total: number;
            vat19: number;
            vat7: number;
        },
    },
}
