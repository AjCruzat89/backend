<?php

use App\Http\Controllers\authController;
use App\Http\Controllers\bookController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;


/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider and all of them will
| be assigned to the "api" middleware group. Make something great!
|
*/

Route::middleware('auth:sanctum')->get('/user', function (Request $request) {
    return $request->user();
});

Route::POST('register', [authController::class, 'register']);
Route::POST('login', [authController::class, 'login']);
Route::GET('getUsers', [authController::class, 'getUsers']);
Route::POST('updateUser', [authController::class, 'updateUser']);
Route::POST('deleteUser', [authController::class, 'deleteUser']);
Route::POST('addBook', [bookController::class, 'addBook']);
Route::GET('getBooks', [bookController::class, 'getBooks']);

Route::middleware('auth:sanctum')->group(function (){
    Route::GET('authUser' , [AuthController::class, 'authUser']);
});
