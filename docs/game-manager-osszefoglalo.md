# Game Manager – Összefoglaló dokumentáció

## 1. Projekt áttekintés

A **Game Manager** egy webalapú játékkezelő és vásárlási platform. A frontend **Angular 20** (standalone komponens architektúra), a backend **Laravel REST API** alapon működik. Az API alap URL-je: `http://localhost:8000/api`.

Főbb funkciók:

- Sanctum token alapú autentikáció
- Email verifikáció (Mailtrap integráció)
- Szerepkör alapú jogosultságkezelés (User/Admin)
- Játékok CRUD műveletek
- Felhasználói könyvtár (vásárlás, egyenleg kezelés)
- Véleményezési rendszer
- Tranzakció követés
- Soft delete támogatás
- CORS konfiguráció Angular frontend-hez

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

## 3. Indítás

```bash
# Frontend
cd game-manager-frontend
npm install
ng serve
# → http://localhost:4200

# Backend (külön terminál)
cd game-manager-backend
php artisan serve
# → http://localhost:8000/api
```

---

## 4. Mappaszerkezet (Frontend)

```
src/
├── main.ts                        # Bootstrap belépési pont
├── styles.css                     # Globális stílusok
├── index.html
├── environments/
│   ├── environment.ts             # Produkciós konfiguráció
│   └── environment.development.ts # Fejlesztési konfiguráció
└── app/
    ├── app.ts                     # Gyökér komponens
    ├── app.config.ts              # HttpClient + Router + interceptor konfiguráció
    ├── app.routes.ts              # Útvonalak
    ├── components/                # UI komponensek
    ├── guards/                    # Route guardok
    ├── interceptors/              # HTTP interceptorok
    ├── models/                    # TypeScript interfészek
    └── services/                  # API kommunikáció
```

## 5. Mappaszerkezet (Backend)

```


game-manager-backend/
├── `artisan`                      # Laravel CLI indító fájl
├── `composer.json`                # PHP függőségek és autoload beállítások
├── `composer.lock`                # zárolt függőségverziók
├── `Game_Manager_API.postman_collection.json` # Postman API kollekció
├── `phpunit.xml`                  # PHPUnit konfiguráció
├── `README_API.md`                # API dokumentáció
├── `README.md`                    # projekt általános leírása
├── `.env`                         # környezeti változók (lokális konfiguráció)
├── app/
│   ├── Http/
│   │   ├── Controllers/           # HTTP kontrollerek (API / web)
│   │   ├── Middleware/            # köztes rétegek (auth, throttle, stb.)
│   │   ├── Requests/              # FormRequest validációs osztályok
│   │   └── Resources/             # API Resource/transformer osztályok
│   ├── Models/
│   │   ├── `Category.php`         # Category Eloquent modell
│   │   ├── `Game.php`             # Game Eloquent modell
│   │   ├── `Review.php`           # Review modell
│   │   ├── `Transaction.php`      # Transaction modell
│   │   └── `User.php`             # User modell
│   └── Providers/
│       └── `AppServiceProvider.php` # szolgáltatók, bindingok regisztrálása
├── bootstrap/
│   ├── `app.php`                  # alkalmazás bootstrap
│   ├── `providers.php`            # szolgáltatók listája
│   └── cache/
│       ├── `packages.php`         # cache-elt csomagkonfig
│       └── `services.php`         # cache-elt szolgáltatások
├── config/
│   ├── `app.php`                  # alkalmazás beállítások
│   ├── `auth.php`                 # autentikációs beállítások
│   ├── `database.php`             # adatbázis beállítások
│   └── ...                        # további konfigurációs fájlok (mail, queue stb.)
├── database/
│   ├── factories/                 # model factory-k (pl. `UserFactory.php`)
│   ├── migrations/                # migrációk (pl. `2026_03_20_120510_create_games_table.php`)
│   └── seeders/
│       └── `DatabaseSeeder.php`   # adatbázis seederek
├── docs/
│   └── `backend.md`               # backend specifikus dokumentáció
├── public/
│   ├── `index.php`                # front controller
│   ├── `favicon.ico`
│   └── `robots.txt`
├── resources/
│   └── views/                     # Blade nézetek (ha használt)
├── routes/
│   ├── `api.php`                  # API útvonalak
│   ├── `web.php`                  # web útvonalak
│   └── `console.php`              # konzol parancsok regisztrációja
├── storage/
│   ├── app/
│   ├── framework/
│   └── logs/                      # logok és feltöltött fájlok
├── tests/
│   ├── `TestCase.php`
│   └── Feature/                   # funkcionális tesztek
└── vendor/                        # Composer által telepített csomagok

```

---

## Adatbázis Struktúra

### Táblák áttekintése

```
  game-manager_db
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

###  Publikus Végpontok

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

###  Autentikációs Végpontok

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

###  Védett Végpontok (auth:sanctum + verified)

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

###  Admin Végpontok (auth:sanctum + verified + admin)

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
## 6. Komponensek

### 6.1 `Navbar`
- Navigációs sáv minden oldalon.
- Bejelentkezett felhasználónak: név, egyenleg, kosár ikon, profil link.
- Admin felhasználónak: admin menüpontok (új játék, tranzakciók).
- Kijelentkezés gomb.

### 6.2 `Footer`
- Egyszerű lábléc komponens, minden oldalon megjelenik.

### 6.3 `Home` – `components/home/home.ts`
Főoldal, játékok listázásával.

- Oldal alapú lapozás (pagináció).
- Cím alapú keresés (350 ms debounce).
- Szűrés: kategória, min/max ár.
- Rendezés: dátum / ár / cím, növekvő/csökkenő.
- Szűrők visszaállítása.
- Admin felhasználónak törlés gomb minden játéknál.
- Játékra kattintva a részletes nézetbe navigál.

### 6.4 `GameDetails` – `components/game-details/game-details.ts`
Egy adott játék részletes oldala.

- Adatok megjelenítése: cím, kategória, leírás, ár, borítókép.
- Tulajdonlás ellenőrzése – „A könyvtáradban van" jelzés.
- Kosárba helyezés / eltávolítás.
- Review-k listázása átlagos értékeléssel és darabszámmal.
- Új értékelés leadása (1–5 csillag + opcionális szöveg).
- Saját értékelés szerkesztése inline, törlése.
- Admin bárki értékelését törölheti.
- Admin felhasználónak szerkesztés és törlés gomb a játéknál.
- Értékelő nevére / avatárjára kattintva a felhasználó profiljára navigál.

### 6.5 `Login` – `components/login/login.ts`
- Email + jelszó megadása.
- Sikeres bejelentkezés után főoldalra navigál.
- Hibás adatok esetén hibaüzenet.

### 6.6 `Register` – `components/register/register.ts`
- Név, email, jelszó, jelszó megerősítése.
- Kliens oldali jelszó-egyezés ellenőrzés.
- Laravel validációs hibaüzenetek megjelenítése.
- Sikeres regisztráció után 1 másodperccel főoldalra navigál.

### 6.7 `Profile` – `components/profile/profile.ts`
- Saját profil megtekintése és szerkesztése (név, profilkép URL, bemutatkozás, publikus/privát beállítás).
- Egyenleg feltöltése (`TopUpModal` segítségével).
- Saját játékkönyvtár megjelenítése.
- Más felhasználó profiljának megtekintése (ha publikus).
- Tranzakciós előzmények megjelenítése saját profilon.

### 6.8 `GameForm` (Admin) – `components/admin/game-form/game-form.ts`
- Cím, leírás, ár, borítókép URL, kategória megadása.
- Szerkesztési módban az adatok előtöltődnek.
- Mentés után a játék részletes oldalára navigál.

### 6.9 `Transactions` (Admin) – `components/admin/transactions/transactions.ts`
- Összes tranzakció listázása lapozással.
- Szűrés típus szerint (vásárlás / egyenleg feltöltés).
- Felhasználó és játék neve megjelenítve.

### 6.10 `CartModal` – `components/cart-modal/cart-modal.ts`
- Kosárban lévő játékok listája.
- Játék eltávolítása a kosárból.
- Vásárlás egyenlegből vagy bankkártyával (fizetési mód kiválasztása).
- Vásárlás után a kosár kiürül, az egyenleg frissül.

### 6.11 `TopUpModal` – `components/top-up-modal/top-up-modal.ts`
- Összeg megadása és elküldése az API felé.
- Sikeres feltöltés után az egyenleg frissül a profilon.

---

## 7. Szolgáltatások (Services)

### 7.1 `AuthService` – Hitelesítési állapot kezelése

| Metódus / property | Endpoint | Leírás |
|---|---|---|
| `isLoggedIn` | – | Van-e érvényes token a localStorage-ban |
| `isAdmin` | – | Admin-e a bejelentkezett felhasználó |
| `currentUserValue` | – | Az aktuális `User` objektum |
| `login(credentials)` | POST `/login` | Token és user mentése localStorage-ba |
| `register(userData)` | POST `/register` | Regisztráció |
| `logout()` | POST `/logout` | localStorage törlése |
| `getCurrentUser()` | GET `/user` | Aktuális felhasználó lekérése |
| `getUserById(id)` | GET `/users/:id` | Felhasználó lekérése ID alapján |
| `updateProfile(data)` | PUT `/user/profile` | Profil frissítése |

### 7.2 `GameService` – Játékokkal kapcsolatos API hívások

| Metódus | Endpoint | Leírás |
|---|---|---|
| `getGames(page, filters)` | GET `/games` | Listázás szűrőkkel és lapozással |
| `getGame(id)` | GET `/games/:id` | Egy játék lekérése |
| `createGame(game)` | POST `/games` | Új játék létrehozása |
| `updateGame(id, game)` | PUT `/games/:id` | Játék szerkesztése |
| `deleteGame(id)` | DELETE `/games/:id` | Játék törlése |
| `getCategories()` | GET `/categories` | Kategóriák lekérése |

### 7.3 `ReviewService` – Értékelések API hívások

| Metódus | Endpoint | Leírás |
|---|---|---|
| `getReviews(gameId)` | GET `/games/:id/reviews` | Értékelések lekérése |
| `createReview(gameId, review)` | POST `/games/:id/reviews` | Új értékelés |
| `updateReview(gameId, reviewId, review)` | PUT `/games/:id/reviews/:reviewId` | Értékelés szerkesztése |
| `deleteReview(gameId, reviewId)` | DELETE `/games/:id/reviews/:reviewId` | Értékelés törlése |

### 7.4 `CartService` – Lokális kosárkezelés (`BehaviorSubject`)

| Metódus / property | Leírás |
|---|---|
| `items` | Kosárban lévő játékok tömbje |
| `count` | Elemek száma |
| `total` | Teljes összeg |
| `isInCart(gameId)` | Benne van-e a kosárban |
| `addToCart(game)` | Hozzáadás (duplikátum ellenőrzéssel) |
| `removeFromCart(gameId)` | Eltávolítás |
| `clearCart()` | Kosár kiürítése |

> **Megjegyzés:** A kosár nem perzisztált – oldal frissítés után elvész.

### 7.5 `LibraryService` – Könyvtár és vásárlás

| Metódus | Endpoint | Leírás |
|---|---|---|
| `getLibrary()` | GET `/library` | Saját játékok lekérése |
| `getUserLibrary(userId)` | GET `/users/:id/library` | Más felhasználó könyvtára |
| `purchase(gameId, paymentMethod)` | POST `/library/purchase/:id` | Vásárlás |
| `checkOwnership(gameId)` | GET `/library/check/:id` | Tulajdonlás ellenőrzése |
| `addFunds(amount)` | POST `/library/add-funds` | Egyenleg feltöltése |

### 7.6 `TransactionService` – Adminisztrátori tranzakciók

| Metódus | Endpoint | Leírás |
|---|---|---|
| `getTransactions(page, type?)` | GET `/admin/transactions` | Tranzakciók lapozással és típus szűrővel |

---

## 8. Adatmodellek (TypeScript interfészek)

### `User`
```typescript
export interface User {
  id: number;
  name: string;
  email: string;
  role?: string;
  balance?: number;
  profile_picture?: string | null;
  bio?: string | null;
  is_public?: boolean;
  created_at?: string;
  updated_at?: string;
}
```

### `Game`
```typescript
export interface Game {
  id: number;
  title: string;
  description: string;
  price: string | number;
  cover_image: string | null;
  category: Category;
  created_at?: string;
  updated_at?: string;
}
```

### `Category`
```typescript
export interface Category {
  id: number;
  name: string;
  slug: string;
}
```

### `Review`
```typescript
export interface Review {
  id: number;
  user_id: number;
  game_id: number;
  rating: number;
  comment: string | null;
  created_at: string;
  updated_at: string;
  user?: {
    id: number;
    name: string;
    profile_picture: string | null;
  };
}
```

### `Transaction`
```typescript
export interface Transaction {
  id: number;
  user_id: number;
  type: 'purchase' | 'top_up';
  amount: string | number;
  game_id: number | null;
  created_at: string;
  updated_at: string;
  user?: { id: number; name: string; email: string };
  game?: { id: number; title: string } | null;
}
```

---

## 9. Autentikáció és biztonság

### `authGuard`
Funkcionális route guard. Ha a felhasználó nincs bejelentkezve, `/login`-ra irányít át, és a `returnUrl` query paraméterben tárolja az eredeti útvonalat.

### `authInterceptor`
Funkcionális HTTP interceptor. Minden kimenő kéréshez hozzáfűzi az `Authorization: Bearer <token>` fejlécet, ha van token a localStorage-ban.

### Jogosultsági szintek

| Szerep | Lehetőségek |
|---|---|
| Vendég (nem bejelentkezett) | Főoldal, játék részletek, login, regisztráció |
| Felhasználó | + Profil, kosár, vásárlás, értékelés, könyvtár |
| Admin | + Játék létrehozás/szerkesztés/törlés, tranzakciólista, bárki értékelésének törlése |

---

## 10. Adatbázis-tábla kapcsolatok

### Táblák és kapcsolataik

| Tábla | Kapcsolat | Másik tábla | Leírás |
|---|---|---|---|
| `users` | `belongsToMany` | `games` | Pivot: `user_game` (megvásárolt játékok) |
| `games` | `belongsToMany` | `users` | Pivot: `user_game` |
| `games` | `belongsTo` | `categories` | Egy játék egy kategóriába tartozik |
| `categories` | `hasMany` | `games` | Egy kategóriának több játéka lehet |
| `reviews` | `belongsTo` | `users` | Az értékelés egy felhasználóhoz tartozik |
| `reviews` | `belongsTo` | `games` | Az értékelés egy játékhoz tartozik |
| `games` | `hasMany` | `reviews` | Egy játéknak több értékelése lehet |
| `transactions` | `belongsTo` | `users` | A tranzakció egy felhasználóhoz tartozik |
| `transactions` | `belongsTo` | `games` | A tranzakció (opcionálisan) egy játékhoz tartozik |

### Pivot tábla: `user_game`

| Mező | Típus | Leírás |
|---|---|---|
| `user_id` | FK | Felhasználó azonosítója |
| `game_id` | FK | Játék azonosítója |
| `purchased_at` | timestamp | Vásárlás időpontja |

### Soft delete

A `users`, `games` és `reviews` táblák **soft delete**-et használnak (`deleted_at` mező). A törölt rekordok nem jelennek meg a lekérdezésekben, de az adatbázisban megmaradnak.

### Kapcsolati diagram

```
categories ──< games >──< user_game >── users
                  │
                  └──< reviews >── users
                  
users ──< transactions >── games (nullable)
```

---

## 11. Tesztelés

A backend tesztek **PHPUnit** alapon futnak, Laravel `RefreshDatabase` traittel (minden teszt előtt az adatbázis újraépül). A tesztek a `tests/Feature/` mappában találhatók.

### Tesztfájlok

| Fájl | Leírás |
|---|---|
| `tests/Feature/AuthTest.php` | Regisztráció, bejelentkezés, kijelentkezés |
| `tests/Feature/GameTest.php` | Játéklista lekérése |
| `tests/Feature/ReviewTest.php` | Értékelések CRUD műveletek |
| `tests/Feature/LibraryTest.php` | Vásárlás, könyvtár, egyenleg feltöltés |

### Tesztek futtatása

```bash
cd game-manager-backend
php artisan test
```

---

## 12. Végpont tesztelés

### Postman

### Manuális tesztelési példák

---

**Végpont:** `POST http://localhost:8000/api/register`

**Leírás:** Felhasználó regisztrációja

**Headerek:**
```
Content-Type: application/json
```

**Body:**
```json
{
  "name": "Teszt",
  "email": "teszt@example.com",
  "password": "password123",
  "password_confirmation": "password123"
}
```

---

**Végpont:** `POST http://localhost:8000/api/login`

**Leírás:** Bejelentkezés

**Headerek:**
```
Content-Type: application/json
```

**Body:**
```json
{
  "email": "teszt@example.com",
  "password": "password123"
}
```

---

**Végpont:** `GET http://localhost:8000/api/games`

**Leírás:** Játékok lekérése (autentikáció nélkül)

**Headerek:** –

**Body:** –

---

**Végpont:** `POST http://localhost:8000/api/library/purchase/1`

**Leírás:** Játék vásárlása egyenlegből (token szükséges)

**Headerek:**
```
Authorization: Bearer <token>
Content-Type: application/json
```

**Body:**
```json
{
  "payment_method": "balance"
}
```

---

**Végpont:** `POST http://localhost:8000/api/games/1/reviews`

**Leírás:** Értékelés létrehozása (token szükséges)

**Headerek:**
```
Authorization: Bearer <token>
Content-Type: application/json
```

**Body:**
```json
{
  "rating": 5,
  "comment": "Remek játék!"
}
```

### Fontos HTTP státuszkódok

| Státusz | Jelentés |
|---|---|
| `200` | Sikeres lekérés / művelet |
| `201` | Sikeres létrehozás |
| `400` | Hibás kérés (pl. elégtelen egyenleg, duplikált vásárlás) |
| `401` | Hitelesítés szükséges |
| `403` | Nincs jogosultság |
| `404` | Az erőforrás nem található |
| `422` | Validációs hiba |
