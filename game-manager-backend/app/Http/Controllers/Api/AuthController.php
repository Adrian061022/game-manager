<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Auth\Events\Registered;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\ValidationException;

class AuthController extends Controller
{
    public function register(Request $request)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|string|email|max:255|unique:users',
            'password' => 'required|string|min:8|confirmed',
        ]);

        $user = User::create([
            'name' => $request->name,
            'email' => $request->email,
            'password' => Hash::make($request->password),
        ]);

        // Send email verification notification
        event(new Registered($user));

        $token = $user->createToken('auth_token')->plainTextToken;

        return response()->json([
            'message' => 'User created successfully',
            'user' => [
                'id' => $user->id,
                'name' => $user->name,
                'email' => $user->email,
            ],
        ], 201);
    }

    public function login(Request $request)
    {
        $request->validate([
            'email' => 'required|email',
            'password' => 'required',
        ]);

        $user = User::where('email', $request->email)->first();

        if (!$user || !Hash::check($request->password, $user->password)) {
            return response()->json([
                'message' => 'Invalid credentials',
            ], 401);
        }

        // Check if email is verified
        if (!$user->hasVerifiedEmail()) {
            return response()->json([
                'message' => 'Email not verified. Please verify your email before logging in.',
            ], 403);
        }

        $token = $user->createToken('auth_token')->plainTextToken;

        return response()->json([
            'message' => 'Login successful',
            'user' => [
                'id' => $user->id,
                'name' => $user->name,
                'email' => $user->email,
                'role' => $user->role,
                'balance' => number_format($user->balance, 2, '.', ''),
                'email_verified' => $user->hasVerifiedEmail(),
            ],
            'token' => $token,
        ]);
    }

    public function logout(Request $request)
    {
        $request->user()->currentAccessToken()->delete();

        return response()->json([
            'message' => 'Sikeres kijelentkezés',
        ]);
    }

    public function user(Request $request)
    {
        return response()->json([
            'user' => $request->user(),
        ]);
    }

    public function updateProfile(Request $request)
    {
        $user = $request->user();

        $request->validate([
            'name' => 'sometimes|string|max:255',
            'profile_picture' => 'sometimes|nullable|url|max:500',
            'bio' => 'sometimes|nullable|string|max:1000',
            'is_public' => 'sometimes|boolean',
        ]);

        $user->update($request->only(['name', 'profile_picture', 'bio', 'is_public']));

        return response()->json([
            'message' => 'Profil sikeresen frissítve',
            'user' => $user->fresh(),
        ]);
    }

    public function getUserById($id)
    {
        $user = User::find($id);

        if (!$user) {
            return response()->json([
                'message' => 'Felhasználó nem található',
            ], 404);
        }

        // Check if profile is public
        if (!$user->is_public) {
            return response()->json([
                'message' => 'Ez a profil privát',
                'user' => [
                    'id' => $user->id,
                    'name' => $user->name,
                    'is_public' => false,
                ]
            ], 403);
        }

        return response()->json([
            'user' => $user,
        ]);
    }

    /**
     * Verify email address
     */
    public function verifyEmail(Request $request)
    {
        $user = User::find($request->route('id'));

        if (!$user) {
            return response()->json([
                'message' => 'Felhasználó nem található',
            ], 404);
        }

        if ($user->hasVerifiedEmail()) {
            return response()->json([
                'message' => 'Az e-mail cím már meg van erősítve',
            ], 200);
        }

        if ($user->markEmailAsVerified()) {
            return response()->json([
                'message' => 'E-mail cím sikeresen megerősítve',
            ], 200);
        }

        return response()->json([
            'message' => 'E-mail megerősítés sikertelen',
        ], 400);
    }

    /**
     * Resend email verification notification
     */
    public function resendVerification(Request $request)
    {
        $user = $request->user();

        if ($user->hasVerifiedEmail()) {
            return response()->json([
                'message' => 'Az e-mail cím már meg van erősítve',
            ], 200);
        }

        $user->sendEmailVerificationNotification();

        return response()->json([
            'message' => 'Megerősítő e-mail újraküldve',
        ], 200);
    }

    /**
     * Check if email is verified
     */
    public function checkEmailVerified(Request $request)
    {
        $isVerified = $request->user()->hasVerifiedEmail();
        
        return response()->json([
            'verified' => $isVerified,
            'message' => $isVerified ? 'Email is verified' : 'Email is not verified'
        ]);
    }
}