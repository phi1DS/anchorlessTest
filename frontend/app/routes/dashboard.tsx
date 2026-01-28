import { useFetcher, useLoaderData } from "react-router";
import type { LoaderData } from "~/+types/types.ts";
import { FileUploadForm } from "~/dashboard/FileUploadForm";
import { FileList } from "~/dashboard/FileList";
import { fetchFiles, uploadFile, deleteFile, jsonResponse } from "~/api/file.tsx";

export async function loader({ request }) {
    const url = new URL(request.url);
    const category = url.searchParams.get("category");

    const files = await fetchFiles(category);

    return { files, category };
}

export async function action({ request }) {
    const formData = await request.formData();
    const actionType = formData.get("_action");

    if (actionType === "delete") {
        const fileId = formData.get("fileId");

        if (!fileId) {
            return jsonResponse({ error: "Missing file id" }, 400);
        }

        const res = await deleteFile(String(fileId));

        if (!res.ok) {
            return jsonResponse({ error: "Failed to delete file" }, 500);
        }

        return jsonResponse({ success: "File deleted successfully" });
    }

    if (actionType === "upload") {
        const res = await uploadFile(formData);

        if (res.status === 422) {
            const data = await res.json();

            return jsonResponse(
                {
                    error:
                        data.errors?.file?.[0] ??
                        data.message ??
                        "Invalid file type",
                },
                422
            );
        }

        if (!res.ok) {
            return jsonResponse({ error: "Failed to upload file" }, 500);
        }

        return jsonResponse({ success: "File uploaded successfully" });
    }

    return jsonResponse({ error: "Unknown action" }, 400);
}

export default function DashboardPage() {
    const { files } = useLoaderData<LoaderData>();
    const actionFetcher = useFetcher();

    const feedback =
        actionFetcher.data?.success ||
        actionFetcher.data?.error;

    return (
        <>
            <div className="max-w-3xl mx-auto p-6">
                {feedback && (
                    <p
                        className={`mb-4 text-sm ${
                            actionFetcher.data?.error
                                ? "text-red-600"
                                : "text-green-600"
                        }`}
                    >
                        {feedback}
                    </p>
                )}
            </div>

            <div className="max-w-3xl mx-auto p-6">
                <FileUploadForm fetcher={actionFetcher} />
            </div>

            <div className="max-w-3xl mx-auto p-6">
                <FileList files={files} fetcher={actionFetcher} />
            </div>
        </>
    );
}
