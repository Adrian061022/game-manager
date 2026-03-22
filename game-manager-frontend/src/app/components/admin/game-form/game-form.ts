import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { GameService } from '../../../services/game.service';
import { GameRequest, Game } from '../../../models/game.model';

@Component({
  selector: 'app-game-form',
  imports: [CommonModule, FormsModule],
  templateUrl: './game-form.html',
  styleUrl: './game-form.css',
  standalone: true,
  providers: [GameService]
})
export class GameForm implements OnInit {
  gameData: GameRequest = {
    title: '',
    description: '',
    price: 0,
    cover_image: '',
    category_id: 1
  };
  isEditMode: boolean = false;
  gameId: number | null = null;
  isLoading: boolean = false;
  errorMessage: string = '';
  successMessage: string = '';

  categories = [
    { id: 1, name: 'Action' },
    { id: 2, name: 'Adventure' },
    { id: 3, name: 'RPG' },
    { id: 4, name: 'Strategy' },
    { id: 5, name: 'Sports' }
  ];

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private gameService: GameService
  ) {}

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.isEditMode = true;
      this.gameId = +id;
      this.loadGame(this.gameId);
    }
  }

  loadGame(id: number): void {
    this.isLoading = true;
    this.gameService.getGame(id).subscribe({
      next: (response: { data: Game }) => {
      const game = response.data;
      this.gameData = {
        title: game.title,
        description: game.description,
        price: +game.price,
        cover_image: game.cover_image || '',
        category_id: game.category.id
      };
      this.isLoading = false;
      },
      error: (error: { error?: { message?: string } }) => {
      console.error('Error loading game:', error);
      this.errorMessage = 'Failed to load game';
      this.isLoading = false;
      }
    });
  }

  onSubmit(): void {
    this.errorMessage = '';
    this.successMessage = '';
    this.isLoading = true;

    const request = this.isEditMode && this.gameId
      ? this.gameService.updateGame(this.gameId, this.gameData)
      : this.gameService.createGame(this.gameData);

    request.subscribe({
      next: (response: { data: Game }) => {
      this.successMessage = this.isEditMode 
        ? 'Game updated successfully!' 
        : 'Game created successfully!';
      
      setTimeout(() => {
        this.router.navigate(['/game', response.data.id]);
      }, 1500);
      },
      error: (error: { error?: { message?: string; errors?: Record<string, string[]> } }) => {
      console.error('Error saving game:', error);
      this.errorMessage = error.error?.message || 'Failed to save game';
      if (error.error?.errors) {
        const errors = Object.values(error.error.errors).flat();
        this.errorMessage = errors.join(', ');
      }
      this.isLoading = false;
      }
    });
  }

  cancel(): void {
    if (this.isEditMode && this.gameId) {
      this.router.navigate(['/game', this.gameId]);
    } else {
      this.router.navigate(['/']);
    }
  }
}