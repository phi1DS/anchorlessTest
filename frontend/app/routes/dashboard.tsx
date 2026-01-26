import type { Route } from "./+types/file";
import {Form, redirect} from "react-router";

export async function loader() {
    const res = await fetch(`${process.env.API_BASE_URL}/api/files`);
    if (!res.ok) {
        throw new Error("Failed to fetch files");
    }

    const files = await res.json();

    return { files };
}

export async function action({ request }) {
    const formData = await request.formData();
    const fileId = formData.get("fileId");

    if (!fileId) {
        throw new Error("Missing file id");
    }

    const res = await fetch(
        `${process.env.API_BASE_URL}/api/files/${fileId}`,
        {
            method: "DELETE",
        }
    );

    if (!res.ok) {
        throw new Error("Failed to delete file");
    }

    return redirect("."); // could be improved to remove only the deleted file element without reloading the page
}

export default function DashboardPage({ loaderData }: Route.ComponentProps) {

    return (
        <>
            <div className="max-w-3xl mx-auto p-6">
                <h1 className="text-3xl font-extrabold mb-6">
                    Upload a file
                </h1>
            </div>

            <div className="max-w-3xl mx-auto p-6">
                <h1 className="text-3xl font-extrabold mb-6">
                    Uploaded Files
                </h1>

                {loaderData.files.length === 0 && (
                    <p className="text-lg">No files uploaded yet.</p>
                )}

                {loaderData.files.length > 0 && (
                    <ul className="flex flex-wrap gap-4 text-xs">
                        {loaderData.files.map((file) => (
                            <li
                                key={file.id}
                                className="p-4 border border-gray-200 rounded-lg"
                            >
                                <p>{file.name}</p>
                                <p className="text-gray-500 mt-4">Category : {file.category}</p>

                                <Form method="post">
                                    <input
                                        type="hidden"
                                        name="fileId"
                                        value={file.id}
                                    />

                                    <button
                                        type="submit"
                                        className="mt-4 text-red-500 hover:underline hover:cursor-pointer text-xs"
                                    >
                                        Delete
                                    </button>
                                </Form>
                            </li>
                        ))}
                    </ul>
                )}
            </div>
        </>
    );
}
