
export interface Category {
    id: number;
    name: string;
}

export const fetchCategories = async (): Promise<Category[]> => {
    const res = await fetch('/api/categories');
    return await res.json();
};
