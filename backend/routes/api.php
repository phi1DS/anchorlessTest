<?php

use App\Http\Controllers\FileController;
use Illuminate\Support\Facades\Route;

Route::prefix('/files')->name('files.')->group(function () {
    Route::delete('/{id}', [FileController::class, 'destroy'])->name('destroy');
    Route::post('', [FileController::class, 'upload'])->name('upload');
    Route::get('', [FileController::class, 'index'])->name('index');
});
