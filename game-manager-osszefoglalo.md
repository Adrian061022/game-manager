# Game Manager – Összefoglaló dokumentáció

## 1. Projekt áttekintés

A **Game Manager** egy webalapú játékkezelő és vásárlási platform. A frontend **Angular 20** (standalone komponens architektúra), a backend **Laravel REST API** alapon működik. Az API alap URL-je: `http://localhost:8000/api`.

---

## 2. Technológiai stack

| Réteg | Technológia | Verzió |
|---|---|---|
| Frontend | Angular | ^20.3.0 |
| Frontend | TypeScript | ~5.9.2 |
| Frontend | RxJS | ~7.8.0 |
| Frontend | Zone.js | ~0.15.0 |
| Backend | Laravel REST API | – |
| Kommunikáció | HTTP (Bearer token) | – |

---

## 3. Indítás

```bash
# Frontend
cd game-manager-frontend
npm install
ng serve
# → http://localhost:4200

# Backend (külön terminál)
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

---

## 5. Útvonalak

| Útvonal | Komponens | Védett? | Leírás |
|---|---|---|---|
| `/` | `Home` | – | Főoldal, játéklista |
| `/login` | `Login` | – | Bejelentkezés |
| `/register` | `Register` | – | Regisztráció |
| `/game/:id` | `GameDetails` | – | Játék részletei |
| `/profile` | `Profile` | ✅ | Saját profil |
| `/profile/:id` | `Profile` | – | Más felhasználó profilja |
| `/admin/game/new` | `GameForm` | ✅ | Új játék létrehozása |
| `/admin/game/edit/:id` | `GameForm` | ✅ | Játék szerkesztése |
| `/admin/transactions` | `Transactions` | ✅ | Tranzakciók listája |
| `**` | – | – | Ismeretlen útvonal → főoldal |

> **Megjegyzés:** A védett (`✅`) útvonalakon az `authGuard` ellenőrzi a bejelentkezési állapotot. Ha a felhasználó nincs bejelentkezve, `/login`-ra irányít át, és a `returnUrl` query paraméterben tárolja az eredeti útvonalat.

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
