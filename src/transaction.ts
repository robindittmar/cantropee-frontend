export interface Transaction {
    id: string;
    rowIdx: number;
    refId: string | undefined;
    category: string;
    insertTimestamp: Date;
    effectiveTimestamp: Date;
    pending: boolean;
    isPositive: boolean;
    value: number;
    value7: number;
    value19: number;
    vat7: number;
    vat19: number;
    note: string | undefined;
}

export interface TransactionDiff {
    insertTimestamp: Date;
    effectiveTimestamp: Date | undefined;
    category: string | undefined;
    value: number | undefined;
    value7: number | undefined;
    value19: number | undefined;
    vat7: number | undefined;
    vat19: number | undefined;
    note: string | null | undefined;
    isDeposit: boolean | undefined;
}

export async function getTransactionById(id: string): Promise<Transaction> {
    const res = await fetch(`/api/transactions/${id}`);
    const t = await res.json();

    return {
        id: t.id,
        rowIdx: t.rowIdx,
        refId: t.refId,
        category: t.category,
        effectiveTimestamp: new Date(t.effectiveTimestamp),
        insertTimestamp: new Date(t.insertTimestamp),
        pending: false,
        isPositive: false,
        value: t.value,
        value19: t.value19,
        value7: t.value7,
        vat19: t.vat19,
        vat7: t.vat7,
        note: t.note,
    };
}
