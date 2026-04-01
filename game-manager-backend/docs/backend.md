# Game Manager - Backend Dokumentáció

> Laravel 12 REST API Sanctum autentikációval, email verifikációval és szerepkör alapú jogosultságkezeléssel

## 📋 Tartalomjegyzék

- [Áttekintés](#áttekintés)
- [Technológiai Stack](#technológiai-stack)
- [Telepítés](#telepítés)
- [Adatbázis Struktúra](#adatbázis-struktúra)
- [API Végpontok](#api-végpontok)
- [Autentikáció & Engedélyezés](#autentikáció--engedélyezés)
- [Email Verifikáció](#email-verifikáció)
- [Postman Tesztelés](#postman-tesztelés)
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

## Telepítés

### 1. Repository klónozása

```bash
git clone https://github.com/yourusername/game-manager.git
cd game-manager/game-manager-backend
```

### 2. Függőségek telepítése

```bash
composer install
```

### 3. Environment fájl beállítása

```bash
cp .env.example .env
php artisan key:generate
```

### 4. .env fájl konfigurálása

```env
APP_NAME="Game Manager"
APP_URL=http://localhost:8000

DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=game-manager_db
DB_USERNAME=root
DB_PASSWORD=

MAIL_MAILER=smtp
MAIL_HOST=sandbox.smtp.mailtrap.io
MAIL_PORT=2525
MAIL_USERNAME=your_mailtrap_username
MAIL_PASSWORD=your_mailtrap_password
MAIL_FROM_ADDRESS="noreply@gamemanager.hu"
```

### 5. Adatbázis létrehozása és migrálás

```bash
# MySQL-ben:
CREATE DATABASE game-manager_db;

# Laravel migrációk futtatása
php artisan migrate --seed
```

### 6. Cache törlése és szerver indítása

```bash
php artisan config:clear
php artisan cache:clear
php artisan serve
```

A szerver elérhető: `http://localhost:8000`

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
| title | string(255) | Játék címe |
| category_id | bigint | Kategória FK |
| description | text | Leírás |
| price | decimal(8,2) | Ár |
| image_url | string | Kép URL |
| playable_url | string | Játszható link |
| deleted_at | timestamp | Soft delete |

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
  },
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
  "id": 1,
  "title": "The Legend of Zelda: Breath of the Wild",
  "category": {
    "id": 1,
    "name": "Akció",
    "slug": "akcio"
  },
  "description": "Nyílt világú kaland...",
  "price": "59.99",
  "image_url": "zelda.jpg",
  "playable_url": null,
  "reviews_count": 5,
  "average_rating": 4.6
}
```

![Game Details](./images/game_details.png)
*Játék részletek*

---

#### GET /api/categories
Kategóriák listázása

```http
GET http://localhost:8000/api/categories
```

**Válasz:**
```json
[
  { "id": 1, "name": "Akció", "slug": "akcio" },
  { "id": 2, "name": "Kaland", "slug": "kaland" },
  { "id": 3, "name": "RPG", "slug": "rpg" }
]
```

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

![Register](./images/register.png)
*Sikeres regisztráció*

![Mailtrap Email](./images/mailtrap_email.png)
*Email verifikációs email a Mailtrap-ben*

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

![Login Success](./images/login_success.png)
*Sikeres bejelentkezés*

![Login Email Not Verified](./images/login_not_verified.png)
*Sikertelen bejelentkezés - nincs verifikálva az email*

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

---

### ✉️ Email Verifikációs Végpontok

#### GET /api/email/verify/{id}/{hash}
Email megerősítése (signed URL)

```http
GET http://localhost:8000/api/email/verify/3/8d1c47c103f0b64c?expires=1774994853&signature=aef359...
```

**Válasz sikeres verifikálásnál:**
```json
{
  "message": "Email verified successfully."
}
```

**Válasz már verifikált emailnél:**
```json
{
  "message": "Email already verified."
}
```

![Email Verified](./images/email_verified.png)
*Sikeres email verifikáció*

---

#### POST /api/email/resend
Verifikációs email újraküldése

```http
POST http://localhost:8000/api/email/resend
Authorization: Bearer {token}
```

**Válasz:**
```json
{
  "message": "Verification email sent successfully"
}
```

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

![Get User](./images/get_user.png)
*Felhasználó adatai*

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
  "message": "Profile updated successfully",
  "user": {
    "id": 1,
    "name": "Updated Name",
    "bio": "New bio",
    "is_public": false
  }
}
```

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
  "games": [
    {
      "id": 1,
      "title": "The Legend of Zelda",
      "price": "59.99",
      "image_url": "zelda.jpg",
      "purchased_at": "2026-03-20T10:30:00.000000Z"
    }
  ],
  "balance": "940.01"
}
```

![Library](./images/library.png)
*Felhasználó könyvtára*

---

#### POST /api/library/purchase/{game}
Játék vásárlása

```http
POST http://localhost:8000/api/library/purchase/2
Authorization: Bearer {token}
Content-Type: application/json

{
  "payment_method": "balance"
}
```

**Válasz sikeres vásárlásnál:**
```json
{
  "message": "Game purchased successfully",
  "game": {
    "id": 2,
    "title": "God of War"
  },
  "remaining_balance": "890.01",
  "transaction": {
    "id": 25,
    "type": "purchase",
    "amount": "49.99",
    "payment_method": "balance"
  }
}
```

**Hibák:**
- `400`: Játék már tulajdonban
- `402`: Nincs elég egyenleg
- `404`: Játék nem található

![Purchase Success](./images/purchase_success.png)
*Sikeres vásárlás*

![Purchase Insufficient Balance](./images/purchase_insufficient.png)
*Sikertelen vásárlás - nincs elég egyenleg*

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

---

#### POST /api/library/add-funds
Egyenleg feltöltése

```http
POST http://localhost:8000/api/library/add-funds
Authorization: Bearer {token}
Content-Type: application/json

{
  "amount": 100
}
```

**Válasz:**
```json
{
  "message": "Funds added successfully",
  "new_balance": "1100.00",
  "transaction": {
    "id": 26,
    "type": "deposit",
    "amount": "100.00",
    "payment_method": null
  }
}
```

![Add Funds](./images/add_funds.png)
*Egyenleg feltöltés*

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
  "message": "Review created successfully",
  "review": {
    "id": 15,
    "user_id": 2,
    "game_id": 1,
    "rating": 5,
    "comment": "Fantasztikus játék!",
    "user": {
      "id": 2,
      "name": "Test User"
    }
  }
}
```

![Create Review](./images/create_review.png)
*Vélemény írása*

---

#### PUT /api/games/{game}/reviews/{review}
Vélemény módosítása

```http
PUT http://localhost:8000/api/games/1/reviews/15
Authorization: Bearer {token}
Content-Type: application/json

{
  "rating": 4,
  "comment": "Nagyon jó játék!"
}
```

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
  "message": "Review deleted successfully"
}
```

---

### 👑 Admin Végpontok (auth:sanctum + verified + admin)

#### POST /api/games
Új játék létrehozása

```http
POST http://localhost:8000/api/games
Authorization: Bearer {admin_token}
Content-Type: application/json

{
  "title": "New Game",
  "category_id": 1,
  "description": "Game description",
  "price": 39.99,
  "image_url": "game.jpg",
  "playable_url": "https://example.com/play"
}
```

**Válasz (201 Created):**
```json
{
  "message": "Game created successfully",
  "game": {
    "id": 13,
    "title": "New Game",
    "category_id": 1,
    "price": "39.99"
  }
}
```

![Create Game](./images/create_game.png)
*Új játék létrehozása (admin)*

---

#### PUT /api/games/{id}
Játék módosítása

```http
PUT http://localhost:8000/api/games/13
Authorization: Bearer {admin_token}
Content-Type: application/json

{
  "title": "Updated Game Title",
  "price": 29.99
}
```

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
  "message": "Game deleted successfully"
}
```

![Delete Game](./images/delete_game.png)
*Játék törlése (soft delete)*

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
    "id": 1,
    "user_id": 2,
    "type": "purchase",
    "amount": "59.99",
    "payment_method": "balance",
    "created_at": "2026-03-20T10:30:00.000000Z",
    "user": {
      "id": 2,
      "name": "Test User",
      "email": "test@example.com"
    }
  }
]
```

![Admin Transactions](./images/admin_transactions.png)
*Tranzakciók listázása (admin)*

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

![Mailtrap Dashboard](./images/mailtrap_dashboard.png)
*Mailtrap dashboard*

![Verification Email Content](./images/verification_email.png)
*Email verifikációs email tartalma*

---

## Postman Tesztelés

### Collection Import

1. **Postman megnyitása**
2. **Import** gomb → **Upload Files**
3. Select: `Game_Manager_API.postman_collection.json`

![Postman Import](./images/postman_import.png)
*Postman collection import*

### Collection struktúra

```
📁 Game Manager API
├── 📁 Auth
│   ├── Register
│   ├── Login (Admin)
│   ├── Login (User)
│   ├── Logout
│   └── Get User
├── 📁 Email Verification
│   ├── Verify Email
│   ├── Resend Verification
│   └── Check Verification Status
├── 📁 Games
│   ├── Get All Games
│   ├── Get Game by ID
│   ├── Create Game (Admin)
│   ├── Update Game (Admin)
│   └── Delete Game (Admin)
├── 📁 Library
│   ├── Get My Library
│   ├── Purchase Game
│   ├── Check Ownership
│   └── Add Funds
├── 📁 Reviews
│   ├── Get Game Reviews
│   ├── Create Review
│   ├── Update Review
│   └── Delete Review
├── 📁 Categories
│   └── Get All Categories
├── 📁 Admin
│   └── Get All Transactions
└── 📁 Unauthorized Tests
    ├── Create Game without Auth
    ├── Create Game as User (not admin)
    └── Access Protected Route without Token
```

### Environment Variables

**Collection Variables:**
- `base_url`: `http://localhost:8000/api`
- `auth_token`: (automatikusan beállítva login után)
- `user_id`: (automatikusan beállítva)
- `game_id`: `1`
- `review_id`: (automatikusan beállítva)

![Postman Variables](./images/postman_variables.png)
*Postman collection változók*

### Automatikus Tesztek

Minden request tartalmaz automatikus teszteket:

**Auth/Login példa:**
```javascript
pm.test("Status code is 200", function () {
    pm.response.to.have.status(200);
});

pm.test("Response has token", function () {
    var jsonData = pm.response.json();
    pm.expect(jsonData.token).to.exist;
    pm.collectionVariables.set("auth_token", jsonData.token);
});

pm.test("User has email verified", function () {
    var jsonData = pm.response.json();
    pm.expect(jsonData.user.email_verified).to.be.true;
});
```

![Postman Test Results](./images/postman_test_results.png)
*Postman automatikus teszt eredmények*

### Teljes teszt futtatás

**Collection Runner használata:**
1. Collection → **Run**
2. Select all requests
3. **Run Game Manager API**

![Postman Runner](./images/postman_runner.png)
*Postman Collection Runner*

![Postman Runner Results](./images/postman_runner_results.png)
*Collection Runner eredmények - 40+ teszt*

---

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

![PHPUnit Test Results](./images/phpunit_results.png)
*PHPUnit teszt eredmények*

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

![All Tests](./images/all_tests.png)
*Összes teszt sikeres futása*

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

![CORS Headers](./images/cors_headers.png)
*CORS headers a response-ban*

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

![Soft Delete](./images/soft_delete_example.png)
*Soft delete példa - deleted_at timestamp*

---

