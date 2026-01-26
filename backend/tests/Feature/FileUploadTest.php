<?php

namespace Tests\Feature;

use App\Models\File;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;
use Tests\TestCase;

class FileUploadTest extends TestCase
{
    use RefreshDatabase;

    public function test_file_can_be_uploaded(): void
    {
        Storage::fake('public');

        $fileName = 'test_document.pdf';
        $file = UploadedFile::fake()->create($fileName, 1024); // 1MB

        $response = $this->postJson('/api/file/upload', [
            'file' => $file,
            'category' => 'A',
        ]);

        $response->assertStatus(201)
            ->assertJson([
                'message' => 'File uploaded successfully',
                'file' => [
                    'name' => 'test_document',
                    'category' => 'A',
                ],
            ]);

        $this->assertDatabaseHas('files', [
            'name' => 'test_document',
            'category' => 'A',
        ]);

        $fileEntry = File::first();
        Storage::disk('public')->assertExists($fileEntry->filepath);
    }

    public function test_invalid_file_type_is_rejected(): void
    {
        Storage::fake('public');

        $file = UploadedFile::fake()->create('document.txt', 100);

        $response = $this->postJson('/api/file/upload', [
            'file' => $file,
        ]);

        $response->assertStatus(422)
            ->assertJsonValidationErrors(['file']);
    }

    public function test_file_too_large_is_rejected(): void
    {
        Storage::fake('public');

        $file = UploadedFile::fake()->create('large_image.jpg', 5000); // ~5MB

        $response = $this->postJson('/api/file/upload', [
            'file' => $file,
        ]);

        $response->assertStatus(422)
            ->assertJsonValidationErrors(['file']);
    }
}
