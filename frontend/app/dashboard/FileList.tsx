import {useFetcher, useSearchParams} from "react-router";
import type { File } from "~/routes/+types/types";

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
                className="border rounded px-3 py-2 text-sm mb-4"
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
                        const extension = file.name.split(".").pop()?.toLowerCase() ?? '';
                        const isImage = ["jpg", "jpeg", "png", "gif"].includes(extension);
                        const isPdf = extension === "pdf";

                        return (
                            <li
                                key={file.id}
                                className="p-4 border border-gray-200 rounded-lg flex items-center gap-3"
                            >
                                <div className="w-12 h-12 flex-shrink-0">
                                    {isImage && (
                                        <img
                                            src={`${import.meta.env.VITE_API_BASE_URL}/storage/${file.filepath}`}
                                            alt={file.name}
                                            className="w-full h-full object-cover rounded"
                                        />
                                    )}
                                    {isPdf && (
                                        <div className="w-full h-full flex items-center justify-center bg-gray-100 rounded text-gray-600 text-xs font-bold">
                                            PDF
                                        </div>
                                    )}
                                    {!isImage && !isPdf && (
                                        <div className="w-full h-full flex items-center justify-center bg-gray-100 rounded text-gray-600 text-xs font-bold">
                                            FILE
                                        </div>
                                    )}
                                </div>

                                <div className="flex-1">
                                    <p className="font-medium text-gray-800">{file.name}</p>
                                    <p className="text-gray-500 mt-1 text-sm">Category: {file.category}</p>

                                    <fetcher.Form method="post" className="mt-2">
                                        <input type="hidden" name="_action" value="delete" />
                                        <input type="hidden" name="fileId" value={file.id} />

                                        <button
                                            type="submit"
                                            className="text-red-500 hover:underline hover:cursor-pointer text-xs"
                                        >
                                            {fetcher.state === "submitting" ? "Deleting..." : "Delete"}
                                        </button>
                                    </fetcher.Form>
                                </div>
                            </li>
                        );
                    })}
                </ul>
            )}
        </>
    );
}
