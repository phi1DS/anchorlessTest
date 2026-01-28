import { useFetcher } from "react-router";

export function FileUploadForm({ fetcher }: { fetcher: ReturnType<typeof useFetcher>}) {

    return (
        <>
            <h1 className="text-3xl font-extrabold mb-6">
                Upload a file
            </h1>

            <fetcher.Form
                method="post"
                encType="multipart/form-data"
                className="flex flex-col sm:flex-row gap-4 items-start"
            >
                <input type="hidden" name="_action" value="upload" />

                <input type="file" name="file" required className="block text-sm" />

                <select name="category" required className="border rounded px-3 py-2 text-sm text-black bg-white">
                    <option value="" disabled>Select category</option>
                    <option value="A">A</option>
                    <option value="B">B</option>
                    <option value="C">C</option>
                </select>

                <button
                    type="submit"
                    className="bg-black text-white px-4 py-2 rounded text-sm hover:opacity-90 hover:cursor-pointer"
                >
                    {fetcher.state === "submitting" ? "Uploading..." : "Upload"}
                </button>
            </fetcher.Form>
        </>
    );
}
