# Game Manager - Backend API Dokumentáció

## Áttekintés
Laravel REST API egy játékkezelő platformhoz felhasználói hitelesítéssel, játékkönyvtár kezeléssel, értékelésekkel és tranzakciókkal.

## Technológiai stack
- Laravel 12
- MySQL Adatbázis
- Laravel Sanctum (API Hitelesítés)
- RESTful API Architektúra

## Funkciók
- ✅ Felhasználói hitelesítés (Regisztráció, Bejelentkezés, Kijelentkezés)
- ✅ Játék CRUD műveletek (Csak admin)
- ✅ Felhasználói könyvtár kezelés
- ✅ Játék vásárlási rendszer
- ✅ Egyenleg feltöltési rendszer
- ✅ Értékelési rendszer (CRUD)
- ✅ Tranzakció előzmények
- ✅ Nyilvános/Privát felhasználói profilok
- ✅ Kategória kezelés

## Telepítés

### Előfeltételek
- PHP >= 8.2
- Composer
- MySQL
- XAMPP vagy hasonló helyi szerver

### Telepítési lépések

1. **Függőségek telepítése**
```bash
composer install
```

2. **Környezeti konfiguráció**
```bash
cp .env.example .env
php artisan key:generate
```

3. **Adatbázis konfiguráció**
Frissítsd a `.env` fájlt:
```env
DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=game-manager_db
DB_USERNAME=root
DB_PASSWORD=
```

4. **Migrációk és Seederek futtatása**
```bash
php artisan migrate:fresh --seed
```

5. **Fejlesztői szerver indítása**
```bash
php artisan serve
```

Az API elérhető lesz: `http://localhost:8000`

## Alapértelmezett teszt fiókok

A seederek futtatása után használhatod:

**Admin fiók:**
- Email: `admin@example.com`
- Jelszó: `Admin123!`

**Felhasználói fiók:**
- Email: `user@example.com`
- Jelszó: `User123!`

## API Végpontok

### Hitelesítés
- `POST /api/register` - Új felhasználó regisztrálása
- `POST /api/login` - Bejelentkezés
- `POST /api/logout` - Kijelentkezés (Hitelesítés szükséges)
- `GET /api/user` - Aktuális felhasználó lekérése (Hitelesítés szükséges)
- `PUT /api/user/profile` - Profil frissítése (Hitelesítés szükséges)

### Játékok (Nyilvános)
- `GET /api/games` - Összes játék listázása (lapozással, kereséssel, szűrőkkel)
- `GET /api/games/{id}` - Egy játék lekérése
- `GET /api/categories` - Összes kategória lekérése

### Játékok (Csak admin)
- `POST /api/games` - Játék létrehozása
- `PUT /api/games/{id}` - Játék frissítése
- `DELETE /api/games/{id}` - Játék törlése

### Felhasználói könyvtár (Hitelesítés szükséges)
- `GET /api/library` - Felhasználó játékkönyvtárának lekérése
- `POST /api/library/purchase/{game}` - Játék vásárlása
- `GET /api/library/check/{game}` - Ellenőrzés, hogy a felhasználó rendelkezik-e a játékkal
- `POST /api/library/add-funds` - Egyenleg feltöltése

### Értékelések
- `GET /api/games/{game}/reviews` - Játék értékeléseinek lekérése (Nyilvános)
- `POST /api/games/{game}/reviews` - Értékelés létrehozása (Hitelesítés szükséges)
- `PUT /api/games/{game}/reviews/{review}` - Értékelés frissítése (Hitelesítés szükséges, Tulajdonos/Admin)
- `DELETE /api/games/{game}/reviews/{review}` - Értékelés törlése (Hitelesítés szükséges, Tulajdonos/Admin)

### Felhasználók
- `GET /api/users/{id}` - Nyilvános felhasználói profil lekérése
- `GET /api/users/{id}/library` - Felhasználó nyilvános könyvtárának lekérése

### Tranzakciók (Csak admin)
- `GET /api/admin/transactions` - Összes tranzakció listázása

## Adatbázis séma

### Táblák
- `users` - Felhasználói fiókok
- `games` - Játék katalógus
- `categories` - Játék kategóriák
- `user_game` - Felhasználói könyvtár (pivot tábla)
- `reviews` - Játék értékelések
- `transactions` - Vásárlási és feltöltési előzmények
- `personal_access_tokens` - Sanctum tokenek

## Biztonsági funkciók
- Jelszó hashelés bcrypt-tel
- API token hitelesítés (Sanctum)
- CORS védelem
- Bemenet validálás
- SQL injection védelem (Eloquent ORM)
- Admin middleware védett útvonalakhoz

## Fejlesztői megjegyzések
- Minden API válasz JSON formátumú
- Alapértelmezett lapozás: 12 elem (játékok), 25 (tranzakciók)
- Pénznem: HUF (Magyar Forint)
- Értékelési rendszer: 1-5 csillag

## CORS Konfiguráció
Frontend engedélyezett origin: `http://localhost:4200`

Éles környezetbe történő telepítéshez frissítsd a `config/cors.php` fájlt.

## Készítő
Vizsgamunka - 2026
