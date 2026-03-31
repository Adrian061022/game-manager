# Képek a Backend Dokumentációhoz

Ebben a mappában helyezd el a backend dokumentációhoz tartozó képeket.

## Szükséges képek listája

### Alap
- `users_table.png` - Users tábla struktúra phpMyAdmin-ban
- `games_table.png` - Games tábla 12 seed játékkal
- `api_test.png` - API test végpont (Postman/böngésző)

### API Végpontok
- `get_games.png` - Játékok listázása (Postman)
- `game_details.png` - Játék részletek response (Postman)
- `register.png` - Sikeres regisztráció (Postman)
- `login_success.png` - Sikeres bejelentkezés (Postman)
- `login_not_verified.png` - Sikertelen bejelentkezés - nincs verifikálva (Postman)
- `get_user.png` - User adatok lekérése (Postman)
- `library.png` - Felhasználó könyvtára (Postman)
- `purchase_success.png` - Sikeres vásárlás (Postman)
- `purchase_insufficient.png` - Sikertelen vásárlás - nincs elég egyenleg (Postman)
- `add_funds.png` - Egyenleg feltöltés (Postman)
- `create_review.png` - Vélemény írása (Postman)
- `create_game.png` - Új játék létrehozása admin-ként (Postman)
- `delete_game.png` - Játék törlése (Postman)
- `admin_transactions.png` - Tranzakciók listázása admin-ként (Postman)

### Email Verifikáció
- `mailtrap_email.png` - Email verifikációs email a Mailtrap-ben
- `mailtrap_dashboard.png` - Mailtrap dashboard
- `verification_email.png` - Email verifikációs email tartalma
- `email_verified.png` - Sikeres email verifikáció JSON response (Postman/böngésző)

### Postman
- `postman_import.png` - Postman collection import folyamat
- `postman_variables.png` - Postman collection változók beállítása
- `postman_test_results.png` - Automatikus teszt eredmények egy request-ben
- `postman_runner.png` - Collection Runner indítása
- `postman_runner_results.png` - Collection Runner eredmények (40+ teszt)

### PHPUnit Tesztek
- `phpunit_results.png` - PHPUnit teszt eredmények terminálban
- `all_tests.png` - Összes teszt sikeres futása

### Egyéb
- `cors_headers.png` - CORS headers a response-ban (böngésző dev tools / Postman)
- `soft_delete_example.png` - Soft delete példa - deleted_at timestamp (phpMyAdmin)

## Képfelvétel tippek

### Postman képernyőképek
1. Request tab: látszódjon a method, URL, headers
2. Body tab: JSON request body (ha van)
3. Response: Status code, JSON response
4. Tests tab: Automatikus teszt eredmények

### phpMyAdmin képernyőképek
1. Tábla struktúra: Structure tab
2. Adatok: Browse tab
3. Soft delete: deleted_at mező látható

### Terminál képernyőképek
1. Parancs + teljes output
2. Színes kimenet (ha van)
3. Jól olvasható betűméret

## Képformátum ajánlások
- **Formátum:** PNG (jobb minőség)
- **Felbontás:** Minimum 1920x1080 (Full HD)
- **Tömörítés:** Optimalizált (max 500KB/kép)
- **Név:** Kisbetűs, alávonással (pl: `api_test.png`)
