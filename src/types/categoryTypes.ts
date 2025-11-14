export interface parentCategoryType {
    id: number;
    name: string;
}

export interface categoryType {
    id: number;
    name: string;
    parent_id: number;
}

export interface groupedCategoryType {
    id: number;
    name: string;
    children: string[];
}