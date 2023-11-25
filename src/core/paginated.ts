
export interface Paginated<T> {
    start: number;
    count: number;
    total: number;
    data: T[];
}
