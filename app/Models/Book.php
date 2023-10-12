<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Book extends Model
{
    use HasFactory;

    protected $table = 'books';

    protected $primaryKey = 'book_id'; 

    protected $fillable = [
        'book_name',
        'book_cover',
        'book_genre',
        'book_description',
    ];
}
