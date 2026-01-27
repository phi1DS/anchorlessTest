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
    )
}