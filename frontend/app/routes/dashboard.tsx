import type { Route } from "./+types/file";
import {Form, redirect, useFetcher, useSearchParams} from "react-router";

export async function loader({ request }: Route.LoaderArgs) {
    const url = new URL(request.url);
    const category = url.searchParams.get("category");

    const apiUrl = new URL(`${process.env.API_BASE_URL}/api/files`);

    if (category) {
        apiUrl.searchParams.set("category", category);
    }

    const res = await fetch(apiUrl.toString());

    if (!res.ok) {
        throw new Error("Failed to fetch files");
    }

    const files = await res.json();

    return { files, category };
}

export async function action({ request }: Route.ActionArgs) {
    const formData = await request.formData();
    const actionType = formData.get("_action");

    if (actionType === "delete") {
        const fileId = formData.get("fileId");
        if (!fileId) {
            return new Response(JSON.stringify({ error: "Missing file id" }), {
                status: 400,
                headers: { "Content-Type": "application/json" },
            });
        }

        const res = await fetch(`${process.env.API_BASE_URL}/api/files/${fileId}`, { method: "DELETE" });
        if (!res.ok) {
            return new Response(JSON.stringify({ error: "Failed to delete file" }), {
                status: 500,
                headers: { "Content-Type": "application/json" },
            });
        }

        return new Response(JSON.stringify({ success: "File deleted successfully" }), {
            status: 200,
            headers: { "Content-Type": "application/json" },
        });
    }

    if (actionType === "upload") {
        const res = await fetch(`${process.env.API_BASE_URL}/api/files`, {
            method: "POST",
            body: formData,
            headers: {
                "Accept": "application/json",
            },
        });

        if (res.status === 422) {
            const data = await res.json();

            return new Response(JSON.stringify({
                error: data.errors?.file?.[0] ??
                    data.message ??
                    "Invalid file type"
                }),
                {
                    status: 422,
                    headers: { "Content-Type": "application/json" },
                }
            );
        }

        if (!res.ok) {
            return new Response(JSON.stringify({ error: "Failed to upload file" }), {
                status: 500,
                headers: { "Content-Type": "application/json" },
            });
        }

        return new Response(JSON.stringify({ success: "File uploaded successfully" }), {
            status: 200,
            headers: { "Content-Type": "application/json" },
        });
    }

    return new Response(JSON.stringify({ error: "Unknown action" }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
    });
}

export default function DashboardPage({ loaderData }: Route.ComponentProps) {
    const uploadFetcher = useFetcher();
    const deleteFetcher = useFetcher();

    const feedback =
        uploadFetcher.data?.success ||
        deleteFetcher.data?.success ||
        uploadFetcher.data?.error ||
        deleteFetcher.data?.error;

    const [searchParams, setSearchParams] = useSearchParams();
    const selectedCategory = searchParams.get("category") ?? "";

    return (
        <>
            <div className="max-w-3xl mx-auto p-6">

                {feedback && (
                    <p className="mb-4 text-sm text-green-600">
                        {feedback}
                    </p>
                )}

                <h1 className="text-3xl font-extrabold mb-6">
                    Upload a file
                </h1>

                <uploadFetcher.Form
                    method="post"
                    encType="multipart/form-data"
                    className="flex flex-col sm:flex-row gap-4 items-start"
                >
                    <input type="hidden" name="_action" value="upload" />

                    <input
                        type="file"
                        name="file"
                        required
                        className="block text-sm"
                    />

                    <select
                        name="category"
                        required
                        className="border rounded px-3 py-2 text-sm"
                    >
                        <option value="" disabled>Select category</option>
                        <option value="A">A</option>
                        <option value="B">B</option>
                        <option value="C">C</option>
                    </select>

                    <button
                        type="submit"
                        className="bg-black text-white px-4 py-2 rounded text-sm hover:opacity-90 hover:cursor-pointer"
                    >
                        {uploadFetcher.state === "submitting"
                            ? "Uploading..."
                            : "Upload"}
                    </button>
                </uploadFetcher.Form>
            </div>

            <div className="max-w-3xl mx-auto p-6">
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

                {loaderData.files.length === 0 && (
                    <p className="text-lg">No files uploaded yet.</p>
                )}

                {loaderData.files.length > 0 && (
                    <ul className="flex flex-wrap gap-4 text-xs">
                        {loaderData.files.map((file) => {
                            // determine file type by extension
                            const ext = file.name.split(".").pop()?.toLowerCase();
                            const isImage = ["jpg", "jpeg", "png", "gif"].includes(ext);
                            const isPdf = ext === "pdf";

                            console.log(file.filepath);

                            return (
                                <li
                                    key={file.id}
                                    className="p-4 border border-gray-200 rounded-lg flex items-center gap-3"
                                >
                                    {/* File preview */}
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

                                    {/* File info + actions */}
                                    <div className="flex-1">
                                        <p className="font-medium text-gray-800">{file.name}</p>
                                        <p className="text-gray-500 mt-1 text-sm">Category: {file.category}</p>

                                        <deleteFetcher.Form method="post" className="mt-2">
                                            <input type="hidden" name="_action" value="delete" />
                                            <input type="hidden" name="fileId" value={file.id} />

                                            <button
                                                type="submit"
                                                className="text-red-500 hover:underline hover:cursor-pointer text-xs"
                                            >
                                                {deleteFetcher.state === "submitting" ? "Deleting..." : "Delete"}
                                            </button>
                                        </deleteFetcher.Form>
                                    </div>
                                </li>
                            );
                        })}
                    </ul>
                )}
            </div>
        </>
    );
}
