import {FilePreview} from "~/dashboard/FilePreview";
import type {File} from "~/+types/types";
import type {useFetcher} from "react-router";

type Props = {
    file: File;
    fetcher: ReturnType<typeof useFetcher>;
}

export function FileItem({ file, fetcher }: Props) {
    return (
        <li
            key={file.id}
            className="p-4 border border-gray-200 rounded-lg flex items-center gap-3"
        >
            <FilePreview file={file} />

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
}