# Game Manager – Frontend dokumentáció

## Áttekintés

<img width="1915" height="924" alt="image" src="https://github.com/user-attachments/assets/8006c3f0-1371-4430-b9fc-83d00fba63b9" />


Az alkalmazás frontendja **Angular** keretrendszerrel készült (standalone komponens architektúra). A backend Laravel REST API-val kommunikál HTTP-n keresztül, az API alap URL-je: `http://localhost:8000/api`.

---

## Technológiák

| Csomag | Verzió |
|---|---|
| Angular | ^20.3.0 |
| RxJS | ~7.8.0 |
| TypeScript | ~5.9.2 |
| Zone.js | ~0.15.0 |

---

## Mappaszerkezet

```
src/
├── main.ts                        # Bootstrap belépési pont
├── styles.css                     # Globális stílusok
├── index.html
├── environments/
│   ├── environment.ts             # Produkciós konfiguráció
│   └── environment.development.ts # Fejlesztési konfiguráció (apiUrl: localhost:8000)
└── app/
    ├── app.ts                     # Gyökér komponens (Navbar + RouterOutlet + Footer)
    ├── app.html
    ├── app.css
    ├── app.config.ts              # HttpClient + Router + interceptor konfiguráció
    ├── app.routes.ts              # Útvonalak
    ├── components/                # UI komponensek
    ├── guards/                    # Route guardok
    ├── interceptors/              # HTTP interceptorok
    ├── models/                    # TypeScript interfészek
    └── services/                  # API kommunikáció
```

---

## Útvonalak

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

A védett útvonalakon az `authGuard` ellenőrzi, hogy a felhasználó be van-e jelentkezve. Ha nincs, `/login`-ra irányít át.

---

## Komponensek

<img width="1226" height="74" alt="image" src="https://github.com/user-attachments/assets/8c201600-e455-4e50-a4e8-56263243605e" />


### `Navbar`
- Megjeleníti a navigációs sávot.
- Bejelentkezett felhasználónak mutatja a nevet, egyenleget, kosár ikont, profil linket.
- Admin felhasználónak admin menüpontokat jelenít meg (új játék, tranzakciók).
- Kijelentkezés gomb.



### `Footer`

<img width="1898" height="238" alt="image" src="https://github.com/user-attachments/assets/8cc17cf7-8e41-48a7-ba00-99db1b9cf0af" />

- Egyszerű lábléc komponens.
---

### `Home`

<img width="1912" height="908" alt="image" src="https://github.com/user-attachments/assets/ca0273bf-8bd2-40c3-8771-9deeefacbc71" />

**Fájl:** `components/home/home.ts`

A főoldal, amely a játékok listáját jeleníti meg oldalszámozással és szűrési lehetőséggel.

**Funkciók:**
- Játékok listázása lapozással (oldal alapú pagináció).
- Keresés cím alapján (350 ms debounce-szal).
- Szűrés kategória, minimum/maximum ár szerint.
- Rendezés: megjelenés dátuma / ár / cím, növekvő/csökkenő.
- Szűrők visszaállítása.
- Admin felhasználónak törlés gomb jelenik meg minden játéknál.
- Játékra kattintva a részletes nézetbe navigál.

---

### `GameDetails`

<img width="1247" height="730" alt="image" src="https://github.com/user-attachments/assets/1340e57e-cb41-415a-bb89-d135abdc6e42" />


**Fájl:** `components/game-details/game-details.ts`

Egy adott játék részletes oldala.

**Funkciók:**
- Játék adatainak megjelenítése (cím, kategória, leírás, ár, borítókép).
- Tulajdonlás ellenőrzése (ha a felhasználó megvette, „A könyvtáradban van" jelzés jelenik meg).
- Kosárba helyezés / eltávolítás a kosárból.
- Értékelések (review-k) listázása átlagos értékeléssel és darabszámmal.
- Bejelentkezett felhasználó új értékelést adhat le (1–5 csillag + opcionális szöveg).
- Saját értékelés szerkesztése inline módon.
- Saját értékelés törlése; admin bárki értékelését törölheti.
- Admin felhasználónak szerkesztés és törlés gomb jelenik meg a játéknál.
- Értékelő nevére / avatárjára kattintva a felhasználó profiljára navigál.

---

### `Login`
**Fájl:** `components/login/login.ts`

<img width="850" height="607" alt="image" src="https://github.com/user-attachments/assets/04495581-2e55-4993-96ee-419472706f93" />


Bejelentkezési form.

**Funkciók:**
- Email + jelszó megadása.
- Sikeres bejelentkezés után főoldalra irányít.
- Hibás adatok esetén hibaüzenet jelenik meg.

---

### `Register`

<img width="461" height="618" alt="image" src="https://github.com/user-attachments/assets/015fbf26-7cc1-41c8-8fef-67a4755a4255" />


**Fájl:** `components/register/register.ts`

Regisztrációs form.

**Funkciók:**
- Név, email, jelszó, jelszó megerősítése megadása.
- Jelszó egyezés ellenőrzése kliens oldalon.
- Laravel validációs hibaüzenetek megjelenítése.
- Sikeres regisztráció után 1 másodperccel főoldalra navigál.

---

### `Profile`


<img width="1189" height="532" alt="image" src="https://github.com/user-attachments/assets/9c141a27-ecc9-4efd-a5be-79f687bb6b80" />


**Fájl:** `components/profile/profile.ts`

Felhasználói profiloldal.

**Funkciók:**
- Saját profil megtekintése és szerkesztése (név, profilkép URL, bemutatkozás, publikus/privát beállítás).
- Egyenleg feltöltése (`TopUpModal` segítségével).
- Saját játékkönyvtár megjelenítése.
- Más felhasználó profiljának megtekintése (ha a profil publikus).
- Tranzakciós előzmények megjelenítése saját profilon.

---

### `GameForm` (Admin)

<img width="1255" height="893" alt="image" src="https://github.com/user-attachments/assets/8602f05e-2034-4cb3-b1b5-0b77fad55ca7" />


**Fájl:** `components/admin/game-form/game-form.ts`

Adminisztrátori form játék létrehozásához és szerkesztéséhez.

**Funkciók:**
- Cím, leírás, ár, borítókép URL, kategória megadása.
- Szerkesztési módban az adatok előtöltődnek.
- Mentés után a játék részletes oldalára navigál.

---

### `Transactions` (Admin)

<img width="1249" height="307" alt="image" src="https://github.com/user-attachments/assets/0afa71d9-e9bf-41a1-8021-47d87627960b" />


**Fájl:** `components/admin/transactions/transactions.ts`

Adminisztrátori tranzakciós lista.

**Funkciók:**
- Összes tranzakció listázása lapozással.
- Szűrés típus szerint (vásárlás / egyenleg feltöltés).
- Felhasználó és játék neve megjelenítve.

---

### `CartModal`

<img width="535" height="544" alt="image" src="https://github.com/user-attachments/assets/d8c0f78b-c901-4699-ab7b-46daa624f4af" />


**Fájl:** `components/cart-modal/cart-modal.ts`

Kosár modal ablak.

**Funkciók:**
- A kosárban lévő játékok listáját mutatja.
- Játék eltávolítása a kosárból.
- Vásárlás egyenlegből vagy bankkártyával (fizetési mód kiválasztása).
- Vásárlás után a kosár kiürül, az egyenleg frissül.

---

### `TopUpModal`

<img width="1530" height="925" alt="image" src="https://github.com/user-attachments/assets/9e943cc1-c269-4725-bba4-3b359988f61b" />


**Fájl:** `components/top-up-modal/top-up-modal.ts`

Egyenleg feltöltési modal ablak.

**Funkciók:**
- Összeg megadása és elküldése az API felé.
- Sikeres feltöltés után az egyenleg frissül a profilon.

---

## Szolgáltatások (Services)

### `AuthService`
Kezeli a hitelesítési állapotot.

| Metódus / property | Leírás |
|---|---|
| `isLoggedIn` | Van-e érvényes token a localStorage-ban |
| `isAdmin` | A bejelentkezett felhasználó admin-e |
| `currentUserValue` | Az aktuális `User` objektum |
| `login(credentials)` | POST `/login` → tokent és usert ment localStorage-ba |
| `register(userData)` | POST `/register` |
| `logout()` | POST `/logout` → törli a localStorage-t |
| `getCurrentUser()` | GET `/user` |
| `getUserById(id)` | GET `/users/:id` |
| `updateProfile(data)` | PUT `/user/profile` |

---

### `GameService`
Játékokkal kapcsolatos API hívások.

| Metódus | Leírás |
|---|---|
| `getGames(page, filters)` | GET `/games` szűrőkkel és lapozással |
| `getGame(id)` | GET `/games/:id` |
| `createGame(game)` | POST `/games` |
| `updateGame(id, game)` | PUT `/games/:id` |
| `deleteGame(id)` | DELETE `/games/:id` |
| `getCategories()` | GET `/categories` |

---

### `ReviewService`
Értékelésekkel kapcsolatos API hívások.

| Metódus | Leírás |
|---|---|
| `getReviews(gameId)` | GET `/games/:id/reviews` |
| `createReview(gameId, review)` | POST `/games/:id/reviews` |
| `updateReview(gameId, reviewId, review)` | PUT `/games/:id/reviews/:reviewId` |
| `deleteReview(gameId, reviewId)` | DELETE `/games/:id/reviews/:reviewId` |

---

### `CartService`
Lokális (nem perzisztált) kosárkezelés `BehaviorSubject`-tel.

| Metódus / property | Leírás |
|---|---|
| `items` | Kosárban lévő játékok tömbje |
| `count` | Elemek száma |
| `total` | Teljes összeg |
| `isInCart(gameId)` | Benne van-e a kosárban |
| `addToCart(game)` | Hozzáadás (duplikátum ellenőrzéssel) |
| `removeFromCart(gameId)` | Eltávolítás |
| `clearCart()` | Kosár kiürítése |

---

### `LibraryService`
Könyvtár és vásárlás kezelése.

| Metódus | Leírás |
|---|---|
| `getLibrary()` | GET `/library` – saját játékok |
| `getUserLibrary(userId)` | GET `/users/:id/library` |
| `purchase(gameId, paymentMethod)` | POST `/library/purchase/:id` |
| `checkOwnership(gameId)` | GET `/library/check/:id` |
| `addFunds(amount)` | POST `/library/add-funds` |

---

### `TransactionService`
Adminisztrátori tranzakció lekérdezés.

| Metódus | Leírás |
|---|---|
| `getTransactions(page, type?)` | GET `/admin/transactions` lapozással és opcionális típus szűrővel |

---

## Modellek (Interfészek)

### `User`
```php

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
```php

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
```php

export interface Category {
  id: number;
  name: string;
  slug: string;
}

```

### `Review`
```php

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
```php

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

## Autentikáció és biztonság

### `authGuard`
Funkcionális route guard. Ha a felhasználó nincs bejelentkezve, `/login`-ra irányít, és a `returnUrl` query paraméterben tárolja az eredeti útvonalat.

### `authInterceptor`
Funkcionális HTTP interceptor. Minden kimenő kéréshez hozzáfűzi a `Authorization: Bearer <token>` fejlécet, ha van token a localStorage-ban.

---

## Indítás

```bash
cd game-manager-frontend
npm install
ng serve
```

Az alkalmazás alapértelmezetten a `http://localhost:4200` címen érhető el, és a `http://localhost:8000/api` backend API-t használja.
