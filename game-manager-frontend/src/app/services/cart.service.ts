import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Game } from '../models/game.model';

@Injectable({ providedIn: 'root' })
export class CartService {
  private cartSubject = new BehaviorSubject<Game[]>([]);
  cart$ = this.cartSubject.asObservable();

  get items(): Game[] { return this.cartSubject.value; }
  get count(): number { return this.cartSubject.value.length; }
  get total(): number {
    return this.cartSubject.value.reduce((sum, g) => sum + Number(g.price), 0);
  }

  isInCart(gameId: number): boolean {
    return this.cartSubject.value.some(g => g.id === gameId);
  }

  addToCart(game: Game): void {
    if (!this.isInCart(game.id)) {
      this.cartSubject.next([...this.cartSubject.value, game]);
    }
  }

  removeFromCart(gameId: number): void {
    this.cartSubject.next(this.cartSubject.value.filter(g => g.id !== gameId));
  }

  clearCart(): void {
    this.cartSubject.next([]);
  }
}
