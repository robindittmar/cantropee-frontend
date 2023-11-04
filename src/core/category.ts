import {req} from "@/core/requests";

export interface Category {
    id: number;
    name: string;
}

export const fetchCategories = async (): Promise<Category[]> => {
    const res = await req('/api/categories');
    return await res.json();
};
