const API_BASE_URL = process.env.API_BASE_URL!;

export async function fetchFiles(category?: string | null) {
    const apiUrl = new URL(`${API_BASE_URL}/api/files`);

    if (category) {
        apiUrl.searchParams.set("category", category);
    }

    const res = await fetch(apiUrl.toString());

    if (!res.ok) {
        throw new Error("Failed to fetch files");
    }

    return res.json();
}

export async function uploadFile(formData: FormData) {
    return fetch(`${API_BASE_URL}/api/files`, {
        method: "POST",
        body: formData,
        headers: {
            Accept: "application/json",
        },
    });
}

export async function deleteFile(fileId: string) {
    return fetch(`${API_BASE_URL}/api/files/${fileId}`, {
        method: "DELETE",
    });
}


export function jsonResponse(data: unknown, status = 200) {
    return new Response(JSON.stringify(data), {
        status,
        headers: { "Content-Type": "application/json" },
    });
}
