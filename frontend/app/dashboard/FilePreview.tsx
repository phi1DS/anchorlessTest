import type { File } from "~/+types/types";

type Props = {
    file: File;
}

export function FilePreview({ file }: Props) {
    const extension = file.name.split(".").pop()?.toLowerCase() ?? '';
    const isImage = ["jpg", "jpeg", "png", "gif"].includes(extension);
    const isPdf = extension === "pdf";

    return (
        <div className="w-12 h-12 flex-shrink-0">
            {isImage && (
                <img
                    src={`${import.meta.env.VITE_API_BASE_URL}/storage/${file.filepath}`}
                    alt={file.name}
                    className="w-full h-full object-cover rounded"
                />
            )}
            {isPdf && (
                <a
                    href={`${import.meta.env.VITE_API_BASE_URL}/storage/${file.filepath}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full h-full flex items-center justify-center bg-red-100 rounded text-red-600 text-xs font-bold hover:bg-red-200"
                >
                    PDF
                </a>
            )}
            {!isImage && !isPdf && (
                <div className="w-full h-full flex items-center justify-center bg-gray-100 rounded text-gray-600 text-xs font-bold">
                    FILE
                </div>
            )}
        </div>
    )
}