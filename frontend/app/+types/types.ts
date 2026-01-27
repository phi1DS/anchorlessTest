export type Category = "A" | "B" | "C";

export type File = {
    id: number;
    name: string;
    filepath: string;
    category: Category;
};

export type LoaderData = {
    files: File[];
    category: string | null;
};