import {useFetcher, useSearchParams} from "react-router";
import type { File } from "~/+types/types";
import {FileItem} from "~/dashboard/FileItem";

type Props = {
    files: File[];
    fetcher: ReturnType<typeof useFetcher>;
};

export function FileList({ files, fetcher }: Props) {
    const [searchParams, setSearchParams] = useSearchParams();
    const selectedCategory = searchParams.get("category") ?? "";

    return (
        <>
            <h1 className="text-3xl font-extrabold mb-6">
                Uploaded Files
            </h1>

            <select
                id="category-select"
                value={selectedCategory}
                onChange={(e) => {
                    const value = e.target.value;
                    setSearchParams(value ? { category: value } : {});
                }}
                className="border rounded px-3 py-2 text-sm text-black mb-4 bg-white"
            >
                <option value="">All categories</option>
                <option value="A">A</option>
                <option value="B">B</option>
                <option value="C">C</option>
            </select>

            {files.length === 0 && (
                <p className="text-lg">No files uploaded yet.</p>
            )}

            {files.length > 0 && (
                <ul className="flex flex-wrap gap-4 text-xs">
                    {files.map((file: File) => {
                        return (
                            <FileItem key={file.id} file={file} fetcher={fetcher} />
                        );
                    })}
                </ul>
            )}
        </>
    );
}
