# Backend Dokumentáció - Szükséges Képek Listája

> Ezeket a képeket kell elkészíteni és elhelyezni a `docs/images/` könyvtárban

## 📊 Adatbázis Struktúra

- [ ] `users_table.png` - Users tábla struktúra (MySQL/phpMyAdmin screenshot)
- [ ] `games_table.png` - Games tábla struktúra (MySQL/phpMyAdmin screenshot)

## 🔌 API Végpontok

### Publikus végpontok
- [ ] `api_test.png` - GET /api/test válasz
- [ ] `get_games.png` - GET /api/games válasz (játékok listája)
- [ ] `game_details.png` - GET /api/games/{id} válasz (egy játék részletei)

### Autentikáció
- [ ] `register.png` - POST /api/register sikeres válasz
- [ ] `mailtrap_email.png` - Email verifikációs email a Mailtrap-ben
- [ ] `login_success.png` - POST /api/login sikeres bejelentkezés
- [ ] `login_not_verified.png` - POST /api/login - nem verifikált email hibaüzenet

### Email Verifikáció
- [ ] `email_verified.png` - GET /api/email/verify sikeres verifikáció
- [ ] `mailtrap_dashboard.png` - Mailtrap dashboard
- [ ] `verification_email.png` - Email verifikációs email tartalma

### Védett végpontok
- [ ] `get_user.png` - GET /api/user válasz
- [ ] `library.png` - GET /api/library válasz (felhasználó könyvtára)
- [ ] `purchase_success.png` - POST /api/library/purchase sikeres vásárlás
- [ ] `purchase_insufficient.png` - POST /api/library/purchase - nincs elég egyenleg
- [ ] `add_funds.png` - POST /api/library/add-funds válasz
- [ ] `create_review.png` - POST /api/games/{game}/reviews válasz

### Admin végpontok
- [ ] `create_game.png` - POST /api/games sikeres játék létrehozás (admin)
- [ ] `delete_game.png` - DELETE /api/games/{id} soft delete
- [ ] `admin_transactions.png` - GET /api/admin/transactions válasz

## 📮 Postman Tesztelés

- [ ] `postman_import.png` - Postman collection import felület
- [ ] `postman_variables.png` - Postman collection változók
- [ ] `postman_test_results.png` - Automatikus teszt eredmények egy request-nél
- [ ] `postman_runner.png` - Postman Collection Runner felület
- [ ] `postman_runner_results.png` - Collection Runner eredmények (40+ teszt)

## ✅ Feature Tesztek

- [ ] `phpunit_results.png` - `php artisan test` kimenet
- [ ] `all_tests.png` - Összes teszt sikeres futása

## ⚙️ Egyéb

- [ ] `cors_headers.png` - CORS headers a response-ban
- [ ] `soft_delete_example.png` - Soft delete példa - deleted_at timestamp az adatbázisban

---

## 📝 Megjegyzések a képek elkészítéséhez:

### API végpontok képei:
- Postman-ben készítsd el a kéréseket
- Világosan látszódjon a response JSON
- 200 OK vagy megfelelő státusz kód legyen látható
- Dark/Light theme - te döntöd el!

### Adatbázis képek:
- phpMyAdmin-ból vagy MySQL Workbench-ből
- Jól látható legyen a tábla struktúra
- Az oszlopok nevei, típusai legyenek olvashatóak

### Mailtrap képek:
- Mailtrap dashboard
- Verification email tartalma (HTML formátum)

### Tesztek képei:
- Terminal screenshot a teszt eredményekről
- Zöld pipák legyenek jól láthatóak
- Postman Runner eredményképernyő

---

**Kép méret ajánlás:**
- Max szélesség: 1200px
- Formátum: PNG
- Optimalizáld a képeket (pl. TinyPNG)

**Elhelyezés:**
`game-manager-backend/docs/images/` könyvtárba
