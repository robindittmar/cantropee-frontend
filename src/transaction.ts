import {Money} from "ts-money";

export interface Transaction {
    id: string;
    rowIdx: number;
    refId: string | undefined;
    category: string;
    insertTimestamp: Date;
    effectiveTimestamp: Date;
    pending: boolean;
    isPositive: boolean;
    value: Money;
    value7: Money;
    value19: Money;
    vat7: Money;
    vat19: Money;
    note: string | undefined;
}

export async function getTransactionById(id: string): Promise<Transaction> {
    const res = await fetch(`/api/transactions/${id}`);
    const t = await res.json();

    return {
        id: t.id,
        rowIdx: t.rowIdx,
        refId: t.refId,
        category: t.category,
        effectiveTimestamp:new Date(t.effectiveTimestamp),
        insertTimestamp: new Date(t.insertTimestamp),
        pending: false,
        isPositive: false,
        value: new Money(t.value.amount, t.value.currency),
        value19: new Money(t.value19.amount, t.value19.currency),
        value7: new Money(t.value7.amount, t.value7.currency),
        vat19: new Money(t.vat19.amount, t.vat19.currency),
        vat7: new Money(t.vat7.amount, t.vat7.currency),
        note: t.note,
    };
}
