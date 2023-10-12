<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Book;

class bookController extends Controller
{
    public function addBook(Request $req){
        $bookName = $req->input('book_name');
        $bookCover = $req->file('book_cover');
        $bookGenre = $req->input('book_genre');
        $bookDescription = $req->input('book_description');

        $existingBook = Book::where('book_name', $bookName)->first();

        if($existingBook){
            return response()->json(['message' => 'Book Already Exists!!!'], 400);
        }
        elseif($bookCover->getSize() > 3 * 1024 * 1024){
            return response()->json(['message' => 'Picture Size Exceeds Over 3 MB!!!'], 400);
        }
        else{
            $book = Book::create([
                'book_name' => $bookName,
                'book_genre' => $bookGenre,
                'book_description' => $bookDescription
            ]);
            $picturePath = $bookCover->store('bookCover', 'public');
            $book->book_cover = $picturePath;
            $book->save();
            return $book;
        }
    }

    public function getBooks(Request $req){
        $books = Book::all();
        foreach($books as $book){
            $book->book_cover_url = asset('storage/' . $book->book_cover);
        }

        return $books;
    }
}
