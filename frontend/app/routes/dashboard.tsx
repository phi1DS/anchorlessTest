import {useFetcher, useLoaderData} from "react-router";
import type {LoaderData} from "./+types/types.ts";
import {FileUploadForm} from "~/dashboard/FileUploadForm";
import {FileList} from "~/dashboard/FileList";

export async function loader({ request }) {
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

export async function action({ request }) {
    function jsonResponse(data: unknown, status = 200) {
        return new Response(JSON.stringify(data), {
            status,
            headers: { "Content-Type": "application/json" },
        });
    }

    const formData = await request.formData();
    const actionType = formData.get("_action");

    if (actionType === "delete") {
        const fileId = formData.get("fileId");
        if (!fileId) {
            return jsonResponse({ error: "Missing file id" }, 400);
        }

        const res = await fetch(`${process.env.API_BASE_URL}/api/files/${fileId}`, { method: "DELETE" });
        if (!res.ok) {
            return jsonResponse({ error: "Failed to delete file" }, 500);
        }

        return jsonResponse({ success: "File deleted successfully" }, 200);
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
            return jsonResponse({ error: "Failed to upload file" }, 500);
        }

        return jsonResponse({ success: "File uploaded successfully" }, 200);
    }

    return jsonResponse({ error: "Unknown action" }, 400);
}

export default function DashboardPage() {
    const loaderData = useLoaderData<LoaderData>();

    const actionFetcher = useFetcher();

    const feedback =
        actionFetcher.data?.success ||
        actionFetcher.data?.error;

    return (
        <>
            <div className="max-w-3xl mx-auto p-6">
                {feedback && (
                    <p className="mb-4 text-sm text-green-600">
                        {feedback}
                    </p>
                )}
            </div>

            <div className="max-w-3xl mx-auto p-6">
                <FileUploadForm fetcher={actionFetcher}/>
            </div>

            <div className="max-w-3xl mx-auto p-6">
                <FileList files={loaderData.files} fetcher={actionFetcher}/>
            </div>
        </>
    );
}
