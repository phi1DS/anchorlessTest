<?php

namespace Tests\Feature;

use App\Models\File;
use App\Enums\Category;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class FileListingTest extends TestCase
{
    use RefreshDatabase;

    public function test_can_list_all_files(): void
    {
        File::create([
            'name' => 'File 1',
            'filepath' => 'uploads/file1.pdf',
            'category' => Category::A,
        ]);

        File::create([
            'name' => 'File 2',
            'filepath' => 'uploads/file2.pdf',
            'category' => Category::B,
        ]);

        $response = $this->getJson('/api/files');

        $response->assertStatus(200)
            ->assertJsonCount(2)
            ->assertJsonFragment(['name' => 'File 1'])
            ->assertJsonFragment(['name' => 'File 2']);
    }

    public function test_can_filter_files_by_category(): void
    {
        File::create([
            'name' => 'File A',
            'filepath' => 'uploads/fileA.pdf',
            'category' => Category::A,
        ]);

        File::create([
            'name' => 'File B',
            'filepath' => 'uploads/fileB.pdf',
            'category' => Category::B,
        ]);

        $response = $this->getJson('/api/files?category=A');

        $response->assertStatus(200)
            ->assertJsonCount(1)
            ->assertJsonFragment(['name' => 'File A'])
            ->assertJsonMissing(['name' => 'File B']);
    }

    public function test_returns_empty_list_for_non_existent_category(): void
    {
        File::create([
            'name' => 'File A',
            'filepath' => 'uploads/fileA.pdf',
            'category' => Category::A,
        ]);

        $response = $this->getJson('/api/files?category=C');

        $response->assertStatus(200)
            ->assertJsonCount(0);
    }
}
