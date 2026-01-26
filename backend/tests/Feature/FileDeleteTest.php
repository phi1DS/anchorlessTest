<?php

namespace Tests\Feature;

use App\Models\File;
use App\Enums\Category;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Storage;
use Tests\TestCase;

class FileDeleteTest extends TestCase
{
    use RefreshDatabase;

    public function test_can_delete_file(): void
    {
        Storage::fake('public');

        $fileEntry = File::create([
            'name' => 'test_file',
            'filepath' => 'uploads/test_file.pdf',
            'category' => Category::A,
        ]);

        Storage::disk('public')->put('uploads/test_file.pdf', 'dummy content');

        $response = $this->deleteJson("/api/file/{$fileEntry->id}");

        $response->assertStatus(200)
            ->assertJson(['message' => 'File deleted successfully']);

        $this->assertDatabaseMissing('files', [
            'id' => $fileEntry->id,
        ]);

        Storage::disk('public')->assertMissing('uploads/test_file.pdf');
    }

    public function test_returns_404_when_deleting_non_existent_file(): void
    {
        $response = $this->deleteJson('/api/file/999');

        $response->assertStatus(404);
    }
}
