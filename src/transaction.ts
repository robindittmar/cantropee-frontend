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
