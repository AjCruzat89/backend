<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Cookie;
use Illuminate\Support\Facades\Hash;

class authController extends Controller
{
    /* <!--===============================================================================================--> */
    public function register(Request $req)
    {
        $username = $req->input('username');
        $password = $req->input('password');
        $rpassword = $req->input('rpassword');

        $existingUser = User::where('username', $username)->first();

        if ($existingUser) {
            return response()->json(['message' => 'Username Already Exists!'], 400);
        } elseif ($password != $rpassword) {
            return response()->json(['message' => 'Passwords do not match!'], 400);
        } elseif (strlen($password) < 8) {
            return response()->json(['message' => 'Password must be 8-12+ digit!'], 400);
        } else {
            $user = User::create([
                'username' => $username,
                'password' => Hash::make($password),
                'is_admin' => $req->input('is_admin', 0),
            ]);
            $user->save();
            return $user;
        }
    }
    /* <!--===============================================================================================--> */
    public function login(Request $req)
    {
        $username = $req->input('username');
        $password = $req->input('password');

        if (!Auth::attempt([
            'username' => $username,
            'password' => $password
        ])) {
            return response()->json(['message' => 'Incorrect Username or Password!'], 400);
        } else {
            $user = Auth::user();
            $token = $user->createToken('token')->plainTextToken;
            $cookie = cookie('jwt', $token);
            return response([$token])->withCookie($cookie);
        }
    }
    /* <!--===============================================================================================--> */
    public function authUser(Request $req)
    {
        if (Auth::check()) {
            $user = Auth::user();
            return $user;
        } else {
            return response()->json(['message' => 'Unauthorized'], 400);
        }
    }
    /* <!--===============================================================================================--> */
    public function getUsers(Request $req)
    {
        $users = User::where('id', '!=', 1)->get();

        if ($users->isEmpty()) {
            return response()->json(['message' => 'No Users'], 400);
        } else {
            return $users;
        }
    }
    /* <!--===============================================================================================--> */

    public function updateUser(Request $req)
    {
        $userID = $req->input('id');
        $username = $req->input('username');
        $password = $req->input('password');

        $user = User::find($userID);

        if (!$user) {
            return response()->json(['message' => 'ID not found'], 400);
        } elseif (!$username || !$password) {
            return response()->json(['message' => 'Please Input Details!'], 400);
        }

        $existingUser = User::where('username', $username)->where('id', '!=', $userID)->first();

        if ($existingUser) {
            return response()->json(['message' => 'Username Is Already Taken!'], 400);
        } elseif ($user->username == $username && $user->password == $password) {
            return response()->json(['message' => 'Matching Details!'], 400);
        } elseif ($user->username == $username) {
            $user->password = $password;
            $user->save();
            return response()->json(['message' => 'Succesfully Updated Password']);
        } elseif ($user->password == $password) {
            $user->username = $username;
            $user->save();
            return response()->json(['message' => 'Succesfully Updated Username']);
        } else {
            $user->username = $username;
            $user->password = Hash::make($password);
            $user->save();
            return response()->json(['message' => 'Successfully Updated User!'], 200);
        }
    }

    /* <!--===============================================================================================--> */

    public function deleteUser(Request $req)
    {
        $userID = $req->input('id');

        if (User::find($userID)->delete()) {
            return response()->json(['message' => 'Deleted User Successfully!'], 200);
        } else {
            return response()->json(['message' => 'ID Not Found!'], 400);
        }
    }
}
