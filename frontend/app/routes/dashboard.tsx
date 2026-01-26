import type { Route } from "./+types/file";

export async function loader() {
    const res = await fetch(`${process.env.API_BASE_URL}/api/files`);
    if (!res.ok) {
        throw new Error("Failed to fetch files");
    }

    const files = await res.json();

    return { files };
}

export default function DashboardPage({ loaderData }: Route.ComponentProps) {

    return (
        <div className="max-w-3xl mx-auto p-6">
            <h1 className="text-3xl font-extrabold text-gray-900 mb-6">
                Uploaded Files
            </h1>

            {loaderData.files.length === 0 && (
                <p className="text-gray-500 text-lg">No files uploaded yet.</p>
            )}

            {loaderData.files.length > 0 && (
                <ul className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {loaderData.files.map((file) => (
                        <li
                            key={file.id}
                            className="flex items-center space-x-3 p-4 border border-gray-200 rounded-lg shadow-sm hover:shadow-md hover:bg-gray-50 transition-shadow duration-150"
                        >
                            <svg
                                className="w-6 h-6 text-blue-500 flex-shrink-0"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth={2}
                                viewBox="0 0 24 24"
                                xmlns="http://www.w3.org/2000/svg"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    d="M7 7v10M17 7v10M7 7h10M7 17h10"
                                />
                            </svg>

                            <span className="text-gray-800 font-medium truncate">{file.name} ({file.category})</span>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
}
