import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { GameService } from '../../services/game.service';
import { AuthService } from '../../services/auth.service';
import { Category, Game, GameFilters, PaginatedGames } from '../../models/game.model';

@Component({
  selector: 'app-home',
  imports: [CommonModule, RouterLink, FormsModule],
  templateUrl: './home.html',
  styleUrl: './home.css',
  standalone: true
})
export class Home implements OnInit {
  games: Game[] = [];
  categories: Category[] = [];
  isLoading: boolean = true;
  errorMessage: string = '';
  currentPage: number = 1;
  lastPage: number = 1;
  total: number = 0;

  filters: GameFilters = {
    search: '',
    category_id: null,
    sort_by: 'created_at',
    sort_order: 'desc',
    min_price: '',
    max_price: '',
  };

  private searchTimer: ReturnType<typeof setTimeout> | null = null;

  constructor(
    private gameService: GameService,
    public authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.gameService.getCategories().subscribe(cats => this.categories = cats);
    this.loadGames();
  }

  loadGames(page: number = 1): void {
    this.isLoading = true;
    this.errorMessage = '';

    this.gameService.getGames(page, this.filters).subscribe({
      next: (response: PaginatedGames) => {
        this.games = response.data;
        this.currentPage = response.meta.current_page;
        this.lastPage = response.meta.last_page;
        this.total = response.meta.total;
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error loading games:', error);
        this.errorMessage = 'Failed to load games. Please try again.';
        this.isLoading = false;
      }
    });
  }

  onSearchChange(): void {
    if (this.searchTimer) clearTimeout(this.searchTimer);
    this.searchTimer = setTimeout(() => this.loadGames(1), 350);
  }

  onFilterChange(): void {
    this.loadGames(1);
  }

  resetFilters(): void {
    this.filters = {
      search: '',
      category_id: null,
      sort_by: 'created_at',
      sort_order: 'desc',
      min_price: '',
      max_price: '',
    };
    this.loadGames(1);
  }

  get hasActiveFilters(): boolean {
    return !!(
      this.filters.search ||
      this.filters.category_id ||
      this.filters.sort_by !== 'created_at' ||
      this.filters.sort_order !== 'desc' ||
      this.filters.min_price !== '' ||
      this.filters.max_price !== ''
    );
  }

  viewGame(id: number): void {
    this.router.navigate(['/game', id]);
  }

  deleteGame(id: number, title: string): void {
    if (!confirm(`Are you sure you want to delete "${title}"?`)) {
      return;
    }

    this.gameService.deleteGame(id).subscribe({
      next: () => {
        this.loadGames(this.currentPage);
      },
      error: (error) => {
        console.error('Error deleting game:', error);
        alert('Failed to delete game. Please try again.');
      }
    });
  }

  nextPage(): void {
    if (this.currentPage < this.lastPage) {
      this.loadGames(this.currentPage + 1);
    }
  }

  previousPage(): void {
    if (this.currentPage > 1) {
      this.loadGames(this.currentPage - 1);
    }
  }
}