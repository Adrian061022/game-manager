import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { GameService } from '../../services/game.service';
import { ReviewService } from '../../services/review.service';
import { LibraryService } from '../../services/library.service';
import { AuthService } from '../../services/auth.service';
import { CartService } from '../../services/cart.service';
import { Game } from '../../models/game.model';
import { Review, ReviewRequest } from '../../models/review.model';

@Component({
  selector: 'app-game-details',
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './game-details.html',
  styleUrl: './game-details.css',
  standalone: true
})
export class GameDetails implements OnInit {
  game: Game | null = null;
  reviews: Review[] = [];
  averageRating: number = 0;
  totalReviews: number = 0;
  ownsGame: boolean = false;
  isLoading: boolean = true;
  errorMessage: string = '';

  newReview: ReviewRequest = { rating: 5, comment: '' };
  submittingReview: boolean = false;
  reviewError: string = '';
  reviewSuccess: string = '';

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private gameService: GameService,
    private reviewService: ReviewService,
    private libraryService: LibraryService,
    public authService: AuthService,
    public cartService: CartService
  ) {}

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.loadGame(+id);
    }
  }

  loadGame(id: number): void {
    this.isLoading = true;
    this.gameService.getGame(id).subscribe({
      next: (response) => {
        this.game = response.data;
        this.loadReviews(id);
        if (this.authService.isLoggedIn) {
          this.checkOwnership(id);
        } else {
          this.isLoading = false;
        }
      },
      error: () => {
        this.errorMessage = 'Nem sikerült betölteni a játékot.';
        this.isLoading = false;
      }
    });
  }

  loadReviews(gameId: number): void {
    this.reviewService.getReviews(gameId).subscribe({
      next: (response) => {
        this.reviews = response.data;
        this.averageRating = response.meta.average_rating;
        this.totalReviews = response.meta.total_reviews;
      },
      error: () => {}
    });
  }

  checkOwnership(gameId: number): void {
    this.libraryService.checkOwnership(gameId).subscribe({
      next: (response) => {
        this.ownsGame = response.owns;
        this.isLoading = false;
      },
      error: () => {
        this.isLoading = false;
      }
    });
  }

  purchase(): void {
    if (!this.game) return;
    this.cartService.addToCart(this.game);
  }

  addToCart(): void {
    if (this.game) this.cartService.addToCart(this.game);
  }

  removeFromCart(): void {
    if (this.game) this.cartService.removeFromCart(this.game.id);
  }

  submitReview(): void {
    if (!this.game) return;
    this.submittingReview = true;
    this.reviewError = '';
    this.reviewSuccess = '';
    this.reviewService.createReview(this.game.id, this.newReview).subscribe({
      next: (response) => {
        this.reviewSuccess = response.message;
        this.reviews.unshift(response.data);
        this.totalReviews++;
        this.newReview = { rating: 5, comment: '' };
        this.submittingReview = false;
        this.loadReviews(this.game!.id);
      },
      error: (error) => {
        this.reviewError = error.error?.message || 'Értékelés küldése sikertelen.';
        this.submittingReview = false;
      }
    });
  }

  deleteReview(reviewId: number): void {
    if (!this.game || !confirm('Biztosan törlöd ezt az értékelést?')) return;
    this.reviewService.deleteReview(this.game.id, reviewId).subscribe({
      next: () => {
        this.reviews = this.reviews.filter(r => r.id !== reviewId);
        this.totalReviews--;
        this.loadReviews(this.game!.id);
      },
      error: () => {}
    });
  }

  editGame(): void {
    if (this.game) {
      this.router.navigate(['/admin/game/edit', this.game.id]);
    }
  }

  deleteGame(): void {
    if (!this.game || !confirm(`Biztosan törlöd a "${this.game.title}" játékot?`)) return;
    this.gameService.deleteGame(this.game.id).subscribe({
      next: () => this.router.navigate(['/']),
      error: () => {}
    });
  }

  isAdmin(): boolean {
    return this.authService.isAdmin;
  }

  isMyReview(review: Review): boolean {
    return review.user_id === this.authService.currentUserValue?.id;
  }

  getStars(rating: number): number[] {
    return Array(rating).fill(0);
  }

  getEmptyStars(rating: number): number[] {
    return Array(5 - rating).fill(0);
  }
}
