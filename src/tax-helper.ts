export function deriveVat(value19: number, value7: number) {
    return {
        vat19: Math.round(((value19 * 100) / 119) * 19) / 100,
        vat7: Math.round(((value7 * 100) / 107) * 7) / 100,
    };
}
