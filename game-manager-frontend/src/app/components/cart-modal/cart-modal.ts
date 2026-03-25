import { Component, EventEmitter, OnDestroy, OnInit, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { forkJoin, Subscription } from 'rxjs';
import { CartService } from '../../services/cart.service';
import { LibraryService } from '../../services/library.service';
import { AuthService } from '../../services/auth.service';
import { Game } from '../../models/game.model';

type CartStep = 'cart' | 'payment' | 'processing' | 'success';

@Component({
  selector: 'app-cart-modal',
  imports: [CommonModule, FormsModule],
  templateUrl: './cart-modal.html',
  styleUrl: './cart-modal.css',
  standalone: true
})
export class CartModal implements OnInit, OnDestroy {
  @Output() close = new EventEmitter<void>();

  step: CartStep = 'cart';
  items: Game[] = [];
  total: number = 0;
  errorMessage = '';
  card = { number: '', name: '', expiry: '', cvv: '' };

  private sub!: Subscription;

  constructor(
    public cartService: CartService,
    private libraryService: LibraryService,
    public authService: AuthService
  ) {}

  ngOnInit(): void {
    this.sub = this.cartService.cart$.subscribe(items => {
      this.items = items;
      this.total = items.reduce((sum, g) => sum + Number(g.price), 0);
    });
  }

  ngOnDestroy(): void {
    this.sub?.unsubscribe();
  }

  removeItem(gameId: number): void {
    this.cartService.removeFromCart(gameId);
  }

  formatCardNumber(event: Event): void {
    const input = event.target as HTMLInputElement;
    let val = input.value.replace(/\D/g, '').substring(0, 16);
    this.card.number = val.replace(/(.{4})/g, '$1 ').trim();
  }

  formatExpiry(event: Event): void {
    const input = event.target as HTMLInputElement;
    let val = input.value.replace(/\D/g, '').substring(0, 4);
    if (val.length > 2) val = val.substring(0, 2) + '/' + val.substring(2);
    this.card.expiry = val;
  }

  isFormValid(): boolean {
    const rawNumber = this.card.number.replace(/\s/g, '');
    return (
      this.items.length > 0 &&
      rawNumber.length === 16 &&
      this.card.name.trim().length >= 3 &&
      /^\d{2}\/\d{2}$/.test(this.card.expiry) &&
      /^\d{3,4}$/.test(this.card.cvv)
    );
  }

  checkout(): void {
    this.step = 'payment';
    this.errorMessage = '';
  }

  backToCart(): void {
    this.step = 'cart';
  }

  submitPayment(): void {
    if (!this.isFormValid()) return;
    this.step = 'processing';
    this.errorMessage = '';
    const purchasedTotal = this.total;

    setTimeout(() => {
      forkJoin(this.items.map(g => this.libraryService.purchase(g.id))).subscribe({
        next: () => {
          const user = this.authService.currentUserValue!;
          this.authService.updateCurrentUser({
            ...user,
            balance: (user.balance ?? 0) - purchasedTotal
          });
          this.cartService.clearCart();
          this.step = 'success';
        },
        error: (err) => {
          this.errorMessage = err.error?.message || 'Vásárlás sikertelen.';
          this.step = 'payment';
        }
      });
    }, 2000);
  }

  dismiss(): void {
    if (this.step !== 'processing') {
      this.close.emit();
    }
  }
}
