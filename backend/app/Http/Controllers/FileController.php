<?php

namespace App\Http\Controllers;

use App\Http\Requests\ListFilesRequest;
use App\Http\Requests\UploadFileRequest;
use App\Models\File;
use Illuminate\Support\Facades\Storage;

class FileController extends Controller
{
    public function index(ListFilesRequest $request): \Illuminate\Http\JsonResponse
    {
        $query = File::query();

        if ($request->has('category')) {
            $query->where('category', $request->get('category'));
        }

        return response()->json($query->get());
    }

    public function upload(UploadFileRequest $request): \Illuminate\Http\JsonResponse
    {
        $file = $request->file('file');
        $originalName = $file->getClientOriginalName();
        $nameWithoutExtension = pathinfo($originalName, PATHINFO_FILENAME);

        $path = $file->store('uploads', 'public');

        $fileEntry = File::create([
            'name' => $nameWithoutExtension,
            'filepath' => $path,
            'category' => $request->get('category'),
        ]);

        return response()->json([
            'message' => 'File uploaded successfully',
            'file' => $fileEntry,
        ], 201);
    }

    public function destroy(int $id): \Illuminate\Http\JsonResponse
    {
        $file = File::findOrFail($id);

        Storage::disk('public')->delete($file->filepath);

        $file->delete();

        return response()->json([
            'message' => 'File deleted successfully',
        ]);
    }
}
