export interface Organization {
    id: string;
    name: string;
    currency: string;
    usesTaxes: boolean;
    privileges: string[];
}
