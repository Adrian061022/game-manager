import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { GameService } from '../../services/game.service';
import { AuthService } from '../../services/auth.service';
import { Game, PaginatedGames } from '../../models/game.model';

@Component({
  selector: 'app-home',
  imports: [CommonModule],
  templateUrl: './home.html',
  styleUrl: './home.scss',
  standalone: true
})
export class Home implements OnInit {
  games: Game[] = [];
  isLoading: boolean = true;
  errorMessage: string = '';
  currentPage: number = 1;
  lastPage: number = 1;
  total: number = 0;

  constructor(
    private gameService: GameService,
    public authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadGames();
  }

  loadGames(page: number = 1): void {
    this.isLoading = true;
    this.errorMessage = '';

    this.gameService.getGames(page).subscribe({
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