# Game Manager - Backend Dokumentáció

> Laravel 12 REST API Sanctum autentikációval, email verifikációval és szerepkör alapú jogosultságkezeléssel

## 📋 Tartalomjegyzék

- [Áttekintés](#áttekintés)
- [Technológiai Stack](#technológiai-stack)
- [Adatbázis Struktúra](#adatbázis-struktúra)
- [API Végpontok](#api-végpontok)
- [Autentikáció & Engedélyezés](#autentikáció--engedélyezés)
- [Email Verifikáció](#email-verifikáció)
- [Feature Tesztek](#feature-tesztek)
- [CORS Konfiguráció](#cors-konfiguráció)
- [Soft Delete](#soft-delete)

---

## Áttekintés

A Game Manager backend egy Laravel 12 alapú REST API, amely játékok kezelését, felhasználói könyvtárat, véleményezési rendszert és tranzakciók követését teszi lehetővé.

**Főbb funkciók:**
- ✅ Sanctum token alapú autentikáció
- ✅ Email verifikáció (Mailtrap integráció)
- ✅ Szerepkör alapú jogosultságkezelés (User/Admin)
- ✅ Játékok CRUD műveletek
- ✅ Felhasználói könyvtár (vásárlás, egyenleg kezelés)
- ✅ Véleményezési rendszer
- ✅ Tranzakció követés
- ✅ Soft delete támogatás
- ✅ CORS konfiguráció Angular frontend-hez

---

## Technológiai Stack

| Technológia | Verzió | Szerepkör |
|------------|--------|-----------|
| **PHP** | 8.2.12 | Backend nyelv |
| **Laravel** | 12.53.0 | Framework |
| **MySQL** | 8.0+ | Adatbázis |
| **Composer** | 2.8.12 | Dependency manager |
| **Laravel Sanctum** | - | API autentikáció |
| **Mailtrap** | - | Email tesztelés |
| **PHPUnit** | - | Tesztelés |

---

## Adatbázis Struktúra

### Táblák áttekintése

```
📊 game-manager_db
├── users (felhasználók)
├── categories (játék kategóriák)
├── games (játékok)
├── reviews (vélemények)
├── user_game (könyvtár - pivot tábla)
├── transactions (tranzakciók)
├── personal_access_tokens (Sanctum tokenek)
├── cache (cache storage)
└── jobs (queue jobs)
```
<img width="434" height="223" alt="image" src="https://github.com/user-attachments/assets/65c71a3f-cc62-4f30-b0e4-86acae98e5bf" />


### Users (Felhasználók)

| Mező | Típus | Leírás |
|------|-------|--------|
| id | bigint | Elsődleges kulcs |
| name | string(255) | Felhasználó neve |
| email | string | Email cím (egyedi) |
| email_verified_at | timestamp | Email megerősítés időpontja |
| password | string | Jelszó hash |
| role | enum('user','admin') | Szerepkör |
| balance | decimal(10,2) | Egyenleg |
| profile_picture | string | Profil kép URL |
| bio | text | Bemutatkozás |
| is_public | boolean | Profil láthatósága |
| created_at | timestamp | Létrehozás időpontja |
| updated_at | timestamp | Módosítás időpontja |
| deleted_at | timestamp | Soft delete |

<img width="495" height="291" alt="image" src="https://github.com/user-attachments/assets/dd49b907-ed2f-4d55-8d08-4510edc5d25d" />


**Seed adatok:**
- Admin: `admin@example.com` / `Admin123!`
- User: `user@example.com` / `User123!`

### Games (Játékok)

| Mező | Típus | Leírás |
|------|-------|--------|
| id | bigint | Elsődleges kulcs |
| title | string(255) (not null) | Játék címe |
| description | text (not null) | Leírás |
| price | decimal(8,2) (not null) | Ár |
| cover_image | string (nullable) | Borítókép URL |
| playable_url | string(500) (nullable) | Játszható link |
| category_id | bigint (FK) | Kategória (cascade delete) |
| created_at | timestamp | Létrehozás időpontja |
| updated_at | timestamp | Módosítás időpontja |
| deleted_at | timestamp (nullable) | Soft delete |

<img width="595" height="218" alt="image" src="https://github.com/user-attachments/assets/23b7ee95-754c-4a47-b44b-70cb8e22f84e" />

### Reviews (Vélemények)

| Mező | Típus | Leírás |
|------|-------|--------|
| id | bigint | Elsődleges kulcs |
| user_id | bigint | Felhasználó FK |
| game_id | bigint | Játék FK |
| rating | integer(1-5) | Értékelés |
| comment | text | Szöveges vélemény |
| deleted_at | timestamp | Soft delete |

<img width="563" height="165" alt="image" src="https://github.com/user-attachments/assets/44a4258a-023a-4216-8e49-8f232b63952c" />

---

## API Végpontok

### 📍 Publikus Végpontok

#### GET /api/games
Összes játék listázása

```http
GET http://localhost:8000/api/games
```

**Query paraméterek:**
- `category_id` (optional) - Szűrés kategória alapján
- `search` (optional) - Keresés cím alapján

**Válasz:**
```json
[
  {
    "id": 1,
    "title": "Counter-Strike 2",
    "description": "For over two decades, Counter-Strike has offered an elite competitive experience, one shaped by millions of players from across the globe. And now the next chapter in the CS story is about to begin. This is Counter-Strike 2.",
    "price": "0.00",
    "cover_image": "https://cdn.cloudflare.steamstatic.com/steam/apps/730/header.jpg",
    "category": {
      "id": 5,
      "name": "Shooter",
      "slug": "shooter"
    },
    "created_at": "2026-04-01T13:01:01.000000Z",
    "updated_at": "2026-04-01T13:01:01.000000Z"
  }
]
```

<img width="1457" height="380" alt="image" src="https://github.com/user-attachments/assets/3b911976-61d8-4402-b0e5-c02ecdb14734" />

---

#### GET /api/games/{id}
Egy játék részletei

```http
GET http://localhost:8000/api/games/1
```

**Válasz:**
```json
{
  "id": 2,
  "title": "Elden Ring",
  "category": {
    "id": 2,
    "name": "RPG",
    "slug": "rpg"
  },
  "description": "THE NEW FANTASY ACTION RPG. Rise, Tarnished, and be guided by grace to brandish the power of the Elden Ring and become an Elden Lord in the Lands Between.",
  "price": "14990.00",
  "cover_image": "https://cdn.cloudflare.steamstatic.com/steam/apps/1245620/header.jpg",
  "playable_url": null,
  "reviews_count": 0,
  "average_rating": 0
}
```
<img width="1447" height="361" alt="image" src="https://github.com/user-attachments/assets/b9339acd-8931-42d5-b0cd-1ae3abe43ead" />

---

#### GET /api/categories
Kategóriák listázása

```http
GET http://localhost:8000/api/categories
```

**Válasz:**
```json
[
  { "id": 1, "name": "Action", "slug": "action" },
  { "id": 2, "name": "RPG", "slug": "rpg" },
  { "id": 3, "name": "Strategy", "slug": "strategy" },
  { "id": 4, "name": "Survival", "slug": "survival" },
  { "id": 5, "name": "Shooter", "slug": "shooter" },
  { "id": 6, "name": "Racing", "slug": "racing" }
]
```
<img width="1462" height="449" alt="image" src="https://github.com/user-attachments/assets/e923775f-16df-4cd3-bb35-adc021ad6ead" />

---

### 🔐 Autentikációs Végpontok

#### POST /api/register
Új felhasználó regisztrációja

```http
POST http://localhost:8000/api/register
Content-Type: application/json

{
  "name": "Test User",
  "email": "test@example.com",
  "password": "Password123!",
  "password_confirmation": "Password123!"
}
```

**Válasz (201 Created):**
```json
{
  "message": "User created successfully",
  "user": {
    "id": 3,
    "name": "Test User",
    "email": "test@example.com"
  }
}
```

**Email:** Verification email elküldve a Mailtrap-be

<img width="1444" height="326" alt="image" src="https://github.com/user-attachments/assets/2d359cbc-d346-4641-b0ae-c0efba354577" />

<img width="600" height="598" alt="image" src="https://github.com/user-attachments/assets/d3097bcc-d51a-4ddc-ae7e-02d108e21bdf" />

---

#### POST /api/login
Bejelentkezés

```http
POST http://localhost:8000/api/login
Content-Type: application/json

{
  "email": "admin@example.com",
  "password": "Admin123!"
}
```

**Válasz sikeres bejelentkezésnél (200 OK):**
```json
{
  "message": "Login successful",
  "user": {
    "id": 1,
    "name": "Admin User",
    "email": "admin@example.com",
    "role": "admin",
    "balance": "1000.00",
    "email_verified": true
  },
  "token": "3|laravel_sanctum_token_here..."
}
```

**Válasz nem verifikált emailnél (403 Forbidden):**
```json
{
  "message": "Email not verified. Please verify your email before logging in."
}
```

<img width="1452" height="442" alt="image" src="https://github.com/user-attachments/assets/ed479b3a-9c2c-4691-826c-ee9a32144e37" />

---

#### POST /api/logout
Kijelentkezés

```http
POST http://localhost:8000/api/logout
Authorization: Bearer {token}
```

**Válasz:**
```json
{
  "message": "Logged out successfully"
}
```
<img width="1358" height="186" alt="image" src="https://github.com/user-attachments/assets/e71c5340-ae4e-4d65-aea5-05d023f803ca" />

---

### ✉️ Email Verifikációs Végpont

---

#### GET /api/email/check
Email verifikációs állapot ellenőrzése

```http
GET http://localhost:8000/api/email/check
Authorization: Bearer {token}
```

**Válasz:**
```json
{
  "verified": true,
  "message": "Email is verified"
}
```
<img width="1308" height="157" alt="image" src="https://github.com/user-attachments/assets/fa0c0ae4-6491-4f5b-aa12-fcf3f10815bf" />

---

### 🎮 Védett Végpontok (auth:sanctum + verified)

#### GET /api/user
Bejelentkezett felhasználó adatai

```http
GET http://localhost:8000/api/user
Authorization: Bearer {token}
```

**Válasz:**
```json
{
  "id": 1,
  "name": "Admin User",
  "email": "admin@example.com",
  "role": "admin",
  "balance": "1000.00",
  "profile_picture": null,
  "bio": "Game enthusiast",
  "is_public": true
}
```
<img width="1342" height="364" alt="image" src="https://github.com/user-attachments/assets/4cae3096-9734-4592-9a4b-93791e99881a" />

---

#### PUT /api/user/profile
Profil frissítése

```http
PUT http://localhost:8000/api/user/profile
Authorization: Bearer {token}
Content-Type: application/json

{
  "name": "Updated Name",
  "bio": "New bio",
  "is_public": false
}
```

**Válasz:**
```json
{
    "message": "Profil sikeresen frissítve",
    "user": {
        "id": 1,
        "name": "Updated Name",
        "email": "admin@example.com",
        "role": "admin",
        "profile_picture": null,
        "bio": "New bio text",
        "is_public": false,
        "email_verified_at": "2026-04-01T13:01:00.000000Z",
        "balance": "1000.00",
        "created_at": "2026-04-01T13:01:00.000000Z",
        "updated_at": "2026-04-01T15:25:36.000000Z",
        "deleted_at": null
    }
}
```
<img width="1320" height="391" alt="image" src="https://github.com/user-attachments/assets/0b6aa4fb-b3a5-44d4-b27a-01fa7897308a" />

---

#### GET /api/library
Felhasználó könyvtára

```http
GET http://localhost:8000/api/library
Authorization: Bearer {token}
```

**Válasz:**
```json
{
    "data": [
        {
            "id": 5,
            "title": "The Witcher 3: Wild Hunt",
            "description": "You are Geralt of Rivia, mercenary monster slayer. Before you stands a war-torn, monster-infested continent you can explore at will. Your current contract? Tracking down Ciri — the Child of Prophecy, a living weapon that can alter the shape of the world.",
            "price": "9990.00",
            "cover_image": "https://cdn.cloudflare.steamstatic.com/steam/apps/292030/header.jpg",
            "category": {
                "id": 2,
                "name": "RPG",
                "slug": "rpg"
            },
            "created_at": "2026-04-01T13:01:01.000000Z",
            "updated_at": "2026-04-01T13:01:01.000000Z"
        }
    ]
}
```
<img width="1393" height="416" alt="image" src="https://github.com/user-attachments/assets/7b513c85-a274-4e7e-a8b1-d1eb542c2b9c" />

---

#### POST /api/library/purchase/{game}
Játék vásárlása

```http
POST http://localhost:8000/api/library/purchase/4
Authorization: Bearer {token}
Content-Type: application/json

{
  "payment_method": "balance"
}
```

**Válasz sikeres vásárlásnál:**
```json
{
    "message": "Játék sikeresen megvásárolva",
    "data": {
        "id": 4,
        "title": "Cyberpunk 2077",
        "description": "Cyberpunk 2077 is an open-world, action-adventure RPG set in the dark future of Night City — a dangerous megalopolis obsessed with power, glamor, and ceaseless body modification.",
        "price": "11990.00",
        "cover_image": "https://cdn.cloudflare.steamstatic.com/steam/apps/1091500/header.jpg",
        "category": {
            "id": 2,
            "name": "RPG",
            "slug": "rpg"
        },
        "created_at": "2026-04-01T13:01:01.000000Z",
        "updated_at": "2026-04-01T13:01:01.000000Z"
    },
    "new_balance": "38020.00"
}
```

**Hibák:**
- `400`: Játék már tulajdonban
- `402`: Nincs elég egyenleg
- `404`: Játék nem található
- 
<img width="1445" height="436" alt="image" src="https://github.com/user-attachments/assets/3f7ae847-39f4-4a66-bb17-11b73c4d9cee" />

---

#### GET /api/library/check/{game}
Tulajdonjog ellenőrzése

```http
GET http://localhost:8000/api/library/check/1
Authorization: Bearer {token}
```

**Válasz:**
```json
{
  "owns_game": true
}
```
<img width="1331" height="154" alt="image" src="https://github.com/user-attachments/assets/32b1883d-3fe2-4a22-96a5-4ab91abdd34d" />

---

#### POST /api/library/add-funds
Egyenleg feltöltése

```http
POST http://localhost:8000/api/library/add-funds
Authorization: Bearer {token}
Content-Type: application/json

{
  "amount": 10000
}
```

**Válasz:**
```json
{
    "message": "Egyenleg sikeresen feltöltve",
    "new_balance": "48020.00"
}

```
<img width="1330" height="173" alt="image" src="https://github.com/user-attachments/assets/c6a71038-fe27-4902-b5bf-3d0de649ce57" />

---

#### POST /api/games/{game}/reviews
Vélemény írása

```http
POST http://localhost:8000/api/games/1/reviews
Authorization: Bearer {token}
Content-Type: application/json

{
  "rating": 5,
  "comment": "Fantasztikus játék!"
}
```

**Válasz:**
```json
{
    "message": "Értékelés sikeresen hozzáadva!",
    "data": {
        "user_id": 10,
        "game_id": 2,
        "rating": 5,
        "comment": "Kiváló játék, nagyon élveztem!",
        "updated_at": "2026-04-01T16:25:45.000000Z",
        "created_at": "2026-04-01T16:25:45.000000Z",
        "id": 2,
        "user": {
            "id": 10,
            "name": "Test User",
            "profile_picture": null
        }
    }
}
```
<img width="1319" height="388" alt="image" src="https://github.com/user-attachments/assets/99f5602b-ebd0-4df0-98e0-cc80a5debede" />

---

#### PUT /api/games/{game}/reviews/{review}
Vélemény módosítása

```http
PUT http://localhost:8000/api/games/1/reviews/15
Authorization: Bearer {token}
Content-Type: application/json

{
    "message": "Értékelés frissítve!",
    "data": {
        "id": 2,
        "user_id": 10,
        "game_id": 2,
        "rating": 4,
        "comment": "Frissített értékelés - még mindig jó!",
        "created_at": "2026-04-01T16:25:45.000000Z",
        "updated_at": "2026-04-01T16:28:32.000000Z",
        "deleted_at": null,
        "user": {
            "id": 10,
            "name": "Test User",
            "profile_picture": null
        }
    }
}
```
<img width="1318" height="403" alt="image" src="https://github.com/user-attachments/assets/46ad377b-6253-4603-a9a8-3666a23638d2" />

---

#### DELETE /api/games/{game}/reviews/{review}
Vélemény törlése (soft delete)

```http
DELETE http://localhost:8000/api/games/1/reviews/15
Authorization: Bearer {token}
```

**Válasz:**
```json
{
    "message": "Értékelés törölve!"
}
```
<img width="1318" height="144" alt="image" src="https://github.com/user-attachments/assets/26b00e17-b783-4641-92b6-af10b0b5b705" />

---

### 👑 Admin Végpontok (auth:sanctum + verified + admin)

#### POST /api/games
Új játék létrehozása

```http
POST http://localhost:8000/api/games
Authorization: Bearer {admin_token}
Content-Type: application/json

{
    "data": {
        "id": 13,
        "title": "New Test Game",
        "description": "A newly created test game",
        "price": "4990.00",
        "cover_image": "https://via.placeholder.com/460x215",
        "category": {
            "id": 1,
            "name": "Action",
            "slug": "action"
        },
        "created_at": "2026-04-01T16:31:24.000000Z",
        "updated_at": "2026-04-01T16:31:24.000000Z"
    }
}
```

**Válasz (201 Created):**
```json
{
  "message": "Game created successfully",
  "game": {
    "id": 13,
    "title": "Hades",
    "category_id": 1,
    "price": "5990.00"
  }
}
```
<img width="1322" height="376" alt="image" src="https://github.com/user-attachments/assets/137f7081-f163-4d5b-8458-a8dbd63b3c02" />

---

#### PUT /api/games/{id}
Játék módosítása

```http
PUT http://localhost:8000/api/games/13
Authorization: Bearer {admin_token}
Content-Type: application/json

{
    "data": {
        "id": 13,
        "title": "Updated Game Title",
        "description": "A newly created test game",
        "price": "5990.00",
        "cover_image": "https://via.placeholder.com/460x215",
        "category": {
            "id": 1,
            "name": "Action",
            "slug": "action"
        },
        "created_at": "2026-04-01T16:31:24.000000Z",
        "updated_at": "2026-04-01T16:33:12.000000Z"
    }
}
```
<img width="1314" height="360" alt="image" src="https://github.com/user-attachments/assets/378ef854-fd92-40ac-b42b-7614141ceaa4" />

---

#### DELETE /api/games/{id}
Játék törlése (soft delete)

```http
DELETE http://localhost:8000/api/games/13
Authorization: Bearer {admin_token}
```

**Válasz:**
```json
{
    "message": "Játék sikeresen törölve"
}
```
<img width="1313" height="154" alt="image" src="https://github.com/user-attachments/assets/6441f817-b310-44a8-8475-2066b9bd3595" />

---

#### GET /api/admin/transactions
Összes tranzakció listázása

```http
GET http://localhost:8000/api/admin/transactions
Authorization: Bearer {admin_token}
```

**Válasz:**
```json
[
  {
{
    "current_page": 1,
    "data": [
        {
            "id": 9,
            "user_id": 10,
            "type": "top_up",
            "amount": "38020.00",
            "payment_method": "balance",
            "game_id": null,
            "created_at": "2026-04-01T16:24:28.000000Z",
            "updated_at": "2026-04-01T16:24:28.000000Z",
            "user": {
                "id": 10,
                "name": "Test User",
                "email": "test616@example.com"
            },
            "game": null
        }
]
```
<img width="1319" height="409" alt="image" src="https://github.com/user-attachments/assets/e238ff54-4754-42ae-a62d-a2f4138289db" />

---

## Autentikáció & Engedélyezés

### Laravel Sanctum

A backend Laravel Sanctum-ot használ API token autentikációhoz.

**Token generálás:**
```php
$token = $user->createToken('auth-token')->plainTextToken;
```

**Token használata:**
```http
Authorization: Bearer {token}
```

### Middleware-ek

| Middleware | Cél | Használat |
|-----------|-----|-----------|
| `auth:sanctum` | Sanctum token ellenőrzés | Védett route-ok |
| `verified` | Email verifikáció ellenőrzés | Verifikáció szükséges |
| `admin` | Admin szerepkör ellenőrzés | Admin műveletek |
| `signed` | URL aláírás ellenőrzés | Email verification link |

**Példa védett route:**
```php
Route::middleware(['auth:sanctum', 'verified'])->group(function () {
    Route::get('/user', [AuthController::class, 'user']);
});
```

**Admin middleware:**
```php
// app/Http/Middleware/IsAdmin.php
if ($request->user()->role !== 'admin') {
    return response()->json(['message' => 'Unauthorized'], 403);
}
```

---

## Email Verifikáció

### Implementáció lépései

1. **User Model - MustVerifyEmail interfész**
```php
use Illuminate\Contracts\Auth\MustVerifyEmail;

class User extends Authenticatable implements MustVerifyEmail
{
    // ...
}
```

2. **Register - Registered event kiváltása**
```php
use Illuminate\Auth\Events\Registered;

event(new Registered($user));
```

3. **Login - Email verifikáció ellenőrzése**
```php
if (!$user->hasVerifiedEmail()) {
    return response()->json([
        'message' => 'Email not verified. Please verify your email before logging in.'
    ], 403);
}
```

4. **Verification Route (signed URL)**
```php
Route::get('/email/verify/{id}/{hash}', function (Request $request) {
    $user = User::findOrFail($request->route('id'));
    
    if ($user->hasVerifiedEmail()) {
        return response()->json(['message' => 'Email already verified.'], 200);
    }
    
    $user->markEmailAsVerified();
    return response()->json(['message' => 'Email verified successfully.'], 200);
})->middleware(['signed'])->name('verification.verify');
```

### Mailtrap Konfiguráció

**.env beállítások:**
```env
MAIL_MAILER=smtp
MAIL_HOST=sandbox.smtp.mailtrap.io
MAIL_PORT=2525
MAIL_USERNAME=your_mailtrap_username
MAIL_PASSWORD=your_mailtrap_password
MAIL_FROM_ADDRESS="noreply@gamemanager.hu"
MAIL_FROM_NAME="${APP_NAME}"
```

**Email sablon:**
Laravel alapértelmezett email verification template-et használ.

<img width="1594" height="332" alt="image" src="https://github.com/user-attachments/assets/dcda271b-9cd5-4f5a-b16a-7190e84ab7e2" />

<img width="417" height="59" alt="image" src="https://github.com/user-attachments/assets/ded5c5ca-db84-4a72-8b36-7fbc17427839" />

---

### Collection struktúra

```
📁 Game Manager API
├── 📁 Test
│   └── API Test
├── 📁 Auth
│   ├── Register
│   ├── Login
│   ├── Login - Invalid Credentials
│   ├── Get User Profile
│   ├── Update Profile
│   └── Logout
├── 📁 Email Verification
│   ├── Check Email Verified Status
│   └── Resend Verification Email
├── 📁 Games
│   ├── Get All Games
│   ├── Get Game By ID
│   ├── Create Game (Admin Only)
│   ├── Update Game (Admin Only)
│   ├── Delete Game (Admin Only)
│   └── Get All Transactions (Admin Only)
├── 📁 Library
│   ├── Get My Library
│   ├── Purchase Game
│   ├── Check Game Ownership
│   └── Add Funds
├── 📁 Reviews
│   ├── Get Game Reviews
│   ├── Create Review
│   ├── Update Review
│   └── Delete Review
├── 📁 Users
│   ├── Get User By ID
│   └── Get User Library (Public)
├── 📁 Categories
│   └── Get All Categories
└── 📁 Unauthorized Tests
    ├── Access Protected Route Without Token
    └── Non-Admin Access Admin Route
```

## Feature Tesztek

### PHPUnit Tesztek Futtatása

```bash
php artisan test
```

**Kimenet:**
```
  PASS  Tests\Feature\AuthTest
  ✓ user can register                                     0.73s
  ✓ user can login with correct credentials               0.05s
  ✓ user cannot login with incorrect credentials          0.04s
  ✓ authenticated user can logout                         0.04s

  PASS  Tests\Feature\GameTest
  ✓ returns all games                                     0.05s

  PASS  Tests\Feature\LibraryTest
  ✓ user can purchase game with sufficient balance        0.04s
  ✓ user cannot purchase game with insufficient balance   0.03s
  ✓ user cannot purchase same game twice                  0.03s
  ✓ user can add funds to balance                         0.03s
  ✓ user can view their library                           0.04s

  PASS  Tests\Feature\ReviewTest
  ✓ authenticated user can create review                  0.04s
  ✓ user cannot review same game twice                    0.04s
  ✓ user can update their own review                      0.03s
  ✓ user cannot update another users review               0.03s
  ✓ user can delete their own review                      0.03s
  ✓ anyone can view game reviews                          0.04s

  Tests:    16 passed (51 assertions)
  Duration: 1.63s
```

### Teszt Kategóriák

#### 1. AuthTest

**tests/Feature/AuthTest.php**

```php
public function test_user_can_register(): void
{
    // Arrange
    $userData = [
        'name' => 'Test User',
        'email' => 'test@example.com',
        'password' => 'password123',
        'password_confirmation' => 'password123'
    ];

    // Act
    $response = $this->postJson('/api/register', $userData);

    // Assert
    $response->assertStatus(201)
             ->assertJsonStructure(['message', 'user', 'access_token']);
}
```

**Teszteli:**
- ✅ Sikeres regisztráció
- ✅ Sikeres bejelentkezés helyes adatokkal
- ✅ Sikertelen bejelentkezés helytelen adatokkal
- ✅ Kijelentkezés

#### 2. GameTest

**tests/Feature/GameTest.php**

**Teszteli:**
- ✅ Játékok listázásának működése

#### 3. LibraryTest

**tests/Feature/LibraryTest.php**

**Teszteli:**
- ✅ Játék vásárlása egyenlegből
- ✅ Nincs elég egyenleg hibakezelés
- ✅ Duplikált vásárlás megakadályozása
- ✅ Egyenleg feltöltés
- ✅ Könyvtár megtekintése

#### 4. ReviewTest

**tests/Feature/ReviewTest.php**

**Teszteli:**
- ✅ Vélemény létrehozása
- ✅ Saját vélemény módosítása
- ✅ Más véleményének módosítása tiltva
- ✅ Saját vélemény törlése
- ✅ Soft delete ellenőrzése

<img width="556" height="701" alt="image" src="https://github.com/user-attachments/assets/041b7851-7e0e-46b8-93c7-a5a59d6fe615" />

### Test Coverage

```bash
php artisan test --coverage
```

**Coverage:**
- Controllers: ~85%
- Models: ~90%
- Middleware: ~95%

---

## CORS Konfiguráció

### bootstrap/app.php

```php
$middleware->api(prepend: [
    \Illuminate\Http\Middleware\HandleCors::class,
]);
```

### config/cors.php

```php
return [
    'paths' => ['api/*', 'sanctum/csrf-cookie'],
    'allowed_methods' => ['*'],
    'allowed_origins' => ['http://localhost:4200'],
    'allowed_headers' => ['*'],
    'supports_credentials' => true,
];
```

**Engedélyezett origin:**
- Angular frontend: `http://localhost:4200`

**CORS Headers:**
- `Access-Control-Allow-Origin: http://localhost:4200`
- `Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS`
- `Access-Control-Allow-Headers: *`
- `Access-Control-Allow-Credentials: true`

---

## Soft Delete

### Implementáció

**Migrations:**
```php
$table->softDeletes(); // deleted_at timestamp
```

**Models:**
```php
use Illuminate\Database\Eloquent\SoftDeletes;

class Game extends Model
{
    use SoftDeletes;
}
```

**Alkalmazás:**
- Users tábla
- Games tábla
- Reviews tábla

### Előnyök

- ✅ Adat megmarad az adatbázisban
- ✅ Visszaállítható `restore()` metódussal
- ✅ Csak `deleted_at` timestamp kerül beállításra
- ✅ Alapértelmezett query-k kihagyják a törölt rekordokat

**Törölt elemek lekérdezése:**
```php
Game::withTrashed()->get(); // Töröltekkel együtt
Game::onlyTrashed()->get(); // Csak töröltek
```
<img width="1648" height="91" alt="image" src="https://github.com/user-attachments/assets/6d4d805f-3224-4980-b1c4-805363159ed3" />

---

