<?php

namespace App\Models;

use App\Enums\Category;
use Illuminate\Database\Eloquent\Model;

class File extends Model
{
    protected $fillable = [
        'name',
        'filepath',
        'category',
    ];

    protected $casts = [
        'category' => Category::class,
    ];
}
