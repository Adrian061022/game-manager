import { Routes } from '@angular/router';
import { authGuard } from './guards/auth-guard';
import { Home } from './components/home/home';
import { Login } from './components/login/login';
import { Register } from './components/register/register';
import { GameDetails } from './components/game-details/game-details';
import { GameForm } from './components/admin/game-form/game-form';
import { Profile } from './components/profile/profile';
import { Transactions } from './components/admin/transactions/transactions';

export const routes: Routes = [
  {
    path: '',
    component: Home,
    title: 'Főoldal - Game Manager'
  },
  {
    path: 'login',
    component: Login,
    title: 'Bejelentkezés - Game Manager'
  },
  {
    path: 'register',
    component: Register,
    title: 'Regisztráció - Game Manager'
  },
  {
    path: 'game/:id',
    component: GameDetails,
    title: 'Játék részletek - Game Manager'
  },
  {
    path: 'profile',
    component: Profile,
    canActivate: [authGuard],
    title: 'Profilom - Game Manager'
  },
  {
    path: 'profile/:id',
    component: Profile,
    title: 'Profil - Game Manager'
  },
  {
    path: 'admin/game/new',
    component: GameForm,
    canActivate: [authGuard],
    title: 'Új játék hozzáadása - Game Manager'
  },
  {
    path: 'admin/game/edit/:id',
    component: GameForm,
    canActivate: [authGuard],
    title: 'Játék szerkesztése - Game Manager'
  },
  {
    path: 'admin/transactions',
    component: Transactions,
    canActivate: [authGuard],
    title: 'Tranzakciók - Game Manager'
  },
  {
    path: '**',
    redirectTo: '',
    pathMatch: 'full'
  }
];
