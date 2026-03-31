# Game Manager API - Email Verification és Postman Tesztek

## Email Verification Implementáció

### 1. Beállítás

#### Mailtrap Regisztráció
1. Regisztrálj a [Mailtrap.io](https://mailtrap.io/) oldalon
2. Hozz létre egy új inboxot
3. Másold ki az SMTP hitelesítési adatokat

#### .env Konfiguráció
Frissítsd a `.env` fájlban a következő értékeket:

```env
MAIL_MAILER=smtp
MAIL_HOST=sandbox.smtp.mailtrap.io
MAIL_PORT=2525
MAIL_USERNAME=your_mailtrap_username_here
MAIL_PASSWORD=your_mailtrap_password_here
MAIL_ENCRYPTION=tls
MAIL_FROM_ADDRESS="noreply@gamemanager.com"
MAIL_FROM_NAME="Game Manager"
```

#### APP_URL beállítása
Fontos, hogy a `.env` fájlban az `APP_URL` megfelelően legyen beállítva a frontend URL-jére:

```env
APP_URL=http://localhost:4200
```

### 2. Email Verification Működése

#### Regisztráció során
Amikor egy felhasználó regisztrál:
1. A rendszer létrehoz egy új user accountot
2. Automatikusan küld egy verification emailt a Mailtrap-en keresztül
3. Az email tartalmaz egy egyedi verification linket

#### API Endpointok

**Check Email Verification Status**
```http
GET /api/email/check
Authorization: Bearer {token}
```

Válasz:
```json
{
  "verified": true
}
```

**Resend Verification Email**
```http
POST /api/email/resend
Authorization: Bearer {token}
```

Válasz:
```json
{
  "message": "Megerősítő e-mail újraküldve"
}
```

**Verify Email (általában email linkből hívódik)**
```http
GET /api/email/verify/{id}/{hash}
```

Válasz:
```json
{
  "message": "E-mail cím sikeresen megerősítve"
}
```

#### Login Válasz
A login response tartalmazza az email verification státuszt:
```json
{
  "message": "Sikeres bejelentkezés",
  "user": {...},
  "access_token": "...",
  "token_type": "Bearer",
  "email_verified": false
}
```

### 3. Email Verification Tesztelése

#### Lépések:
1. **Regisztráció**
   - POST `/api/register` endpoint hívása
   - Látogass el a Mailtrap inboxba
   - Ellenőrizd, hogy megérkezett-e az email

2. **Email Ellenőrzés**
   - GET `/api/email/check` - visszaadja, hogy verified-e
   - Alapértelmezetten `false` lesz regisztráció után

3. **Manual Verification (teszteléshez)**
   ```sql
   UPDATE users SET email_verified_at = NOW() WHERE email = 'user@example.com';
   ```

4. **Újraküldés tesztelése**
   - POST `/api/email/resend` - új email küldése

### 4. Opcionális: Email Verification Kötelezővé tétele

Ha szeretnéd, hogy csak verified userek significhassanak be, az `AuthController.php` login metódusában:

```php
public function login(Request $request)
{
    // ... authentication logic ...
    
    // Uncomment these lines:
    if (!$user->hasVerifiedEmail()) {
        return response()->json([
            'message' => 'Kérjük, erősítse meg az e-mail címét a bejelentkezés előtt.',
        ], 403);
    }
    
    // ... return token ...
}
```

---

## Postman Collection Használata

### 1. Import

1. Nyisd meg a Postmant
2. Kattints az **Import** gombra
3. Válaszd ki a `Game_Manager_API.postman_collection.json` fájlt
4. A collection megjelenik a Postman Collections panelen

### 2. Environment Variables Beállítása

A collection collection variables-t használ. Alapértelmezett értékek:
- `base_url`: `http://localhost:8000/api`
- `auth_token`: (automatikusan kitöltődik login/register után)
- `user_id`: (automatikusan kitöltődik)
- `game_id`: `1`
- `review_id`: (automatikusan kitöltődik)

**Collection Variables szerkesztése:**
1. Kattints a collection nevére (Game Manager API)
2. Válaszd a **Variables** fület
3. Módosítsd a `Current value` oszlopot
4. **Save**

### 3. Tesztek Futtatása

#### Manuális Tesztelés
1. **Login először**: Futtasd a `Auth > Login` requestet
   - Ez beállítja az `auth_token` változót
2. Ezután futtathatod a protected endpointokat

#### Collection Runner
1. Kattints a collection nevére
2. **Run collection** gomb
3. Válaszd ki, mely foldereket szeretnéd futtatni
4. **Run Game Manager API**

#### Javasolt teszt sorrend:
1. **Auth**
   - Register (új user létrehozása)
   - Login (token megszerzése)
   - Get User Profile
2. **Email Verification**
   - Check Email Verified Status
   - Resend Verification Email
3. **Games**
   - Get All Games
   - Get Game By ID
4. **Library**
   - Get My Library
   - Add Funds
   - Purchase Game
5. **Reviews**
   - Create Review
   - Get Game Reviews
   - Update Review

### 4. Automated Tests

Minden requestben vannak automated teszt scriptek:

**Példa - Login Request Tests:**
```javascript
pm.test("Status code is 200", function () {
    pm.response.to.have.status(200);
});

pm.test("Response has token", function () {
    var jsonData = pm.response.json();
    pm.expect(jsonData).to.have.property('access_token');
    pm.collectionVariables.set("auth_token", jsonData.access_token);
});

pm.test("Email verified status returned", function () {
    var jsonData = pm.response.json();
    pm.expect(jsonData).to.have.property('email_verified');
});
```

**Test Results:**
A Collection Runner lefuttatása után látni fogod:
- Összesen hány teszt futott
- Hány successful/failed
- Response idő
- Test scriptek eredményei

### 5. Authorization Tests

A collection tartalmaz **Unauthorized Tests** foldert:
- **Access Protected Route Without Token**: 401 hiba tesztelése
- **Non-Admin Access Admin Route**: 403 hiba tesztelése

Ezek ellenőrzik, hogy a jogosultságkezelés megfelelően működik.

### 6. Admin Tesztek Futtatása

**Admin token megszerzése:**
1. Futtasd a Login requestet ezekkel a credentials-ekkel:
   ```json
   {
     "email": "admin@example.com",
     "password": "Admin123!"
   }
   ```
2. Ez beállítja az admin tokent
3. Most futtathatod az admin endpointokat:
   - Create Game
   - Update Game
   - Delete Game

**Regular User token:**
```json
{
  "email": "user@example.com",
  "password": "User123!"
}
```

---

## Soft Delete Tesztelése

### Adatbázis Ellenőrzés

Miután törlöl valamit (Game, Review, User):

```sql
-- Normál query (nem látja a törölt rekordokat)
SELECT * FROM games;

-- Törölt rekordok megtekintése
SELECT * FROM games WHERE deleted_at IS NOT NULL;

-- Összes rekord (töröltekkel együtt)
SELECT * FROM games;
```

### Laravel Tinker

```bash
php artisan tinker
```

```php
// Soft deleted games
Game::onlyTrashed()->get();

// Include soft deleted
Game::withTrashed()->get();

// Restore soft deleted
$game = Game::onlyTrashed()->first();
$game->restore();

// Force delete (permanent)
$game = Game::find(1);
$game->forceDelete();
```

---

## Hibaelhárítás

### Email nem érkezik meg Mailtrap-en
1. Ellenőrizd a `.env` fájl MAIL_* beállításait
2. `php artisan config:clear` futtatása
3. Nézd meg a Laravel logs-ot: `storage/logs/laravel.log`

### 401 Unauthorized
- Token lejárt vagy érvénytelen
- Futtasd újra a Login requestet
- Ellenőrizd, hogy az Authorization header helyesen van beállítva

### 403 Forbidden
- Nincs megfelelő jogosultság
- Admin token kell (login adminként)
- Ellenőrizd a user role-t az adatbázisban

### 422 Validation Error
- Hiányzik kötelező mező
- Email már létezik (register)
- Rossz formátum (pl. email, password length)

### Database Connection Error
- XAMPP MySQL fut-e
- `.env` DB_* beállítások helyesek-e
- Adatbázis létezik-e (`game-manager_db`)

---

## Összefoglalás

✅ **Email Verification**: Működik Mailtrap-el, regisztrációkor automatikus email küldés  
✅ **Postman Collection**: 40+ endpoint tesztekkel és automated assertions-zel  
✅ **Soft Delete**: Implementálva Games, Reviews, Users táblákban  
✅ **Admin/User jogosultságok**: Middleware-el védve  
✅ **Automated Tests**: Minden endpoint tesztelve success és error esetekre  

**Következő lépések:**
1. Mailtrap account létrehozása
2. `.env` frissítése
3. `php artisan migrate:fresh --seed`
4. Backend szerver indítása: `php artisan serve`
5. Postman collection importálása és tesztelése
