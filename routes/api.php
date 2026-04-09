<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\CategoryController;
use App\Http\Controllers\Api\PostController;
use App\Http\Controllers\Api\SeederController;

use Illuminate\Support\Facades\Artisan;

Route::get('/run-seeder', function () {
    Artisan::call('db:seed');

    return response()->json([
        'message' => 'Seeder executado com sucesso!'
    ]);
});

// Rotas de seed via API
Route::post('/seed/users', [SeederController::class, 'seedUsers']);
Route::post('/seed/categories', [SeederController::class, 'seedCategories']);
Route::post('/seed/posts', [SeederController::class, 'seedPosts']);
Route::post('/seed/all', [SeederController::class, 'seedAll']);

Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);

Route::middleware('auth:sanctum')->group(function () {
    Route::post('/logout', [AuthController::class, 'logout']);
});

Route::middleware('auth:sanctum')->group(function () {
    Route::apiResource('posts', PostController::class);
});

Route::get('/posts', [PostController::class, 'index']);
Route::get('/posts/{id}', [PostController::class, 'show']);

Route::get('/categories', [CategoryController::class, 'show']);

Route::middleware('auth:sanctum')->group(function () {
    Route::post('/categories', [CategoryController::class, 'store']);
    Route::put('/categories/{category}', [CategoryController::class, 'update']);
    Route::delete('/categories/{category}', [CategoryController::class, 'destroy']);
});

