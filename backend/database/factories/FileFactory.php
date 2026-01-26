<?php

namespace Database\Factories;

use App\Enums\Category;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Task>
 */
class FileFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $fakeName = $this->faker->slug(4) . '.pdf';

        return [
            'name' => $fakeName,
            'filepath' => 'uploads/' . $fakeName . '.pdf',
            'category' => Category::A,
        ];
    }
}
