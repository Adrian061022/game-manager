import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, ActivatedRoute, RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { LibraryService } from '../../services/library.service';
import { User } from '../../models/user.model';
import { Game } from '../../models/game.model';
import { TopUpModalComponent } from '../top-up-modal/top-up-modal';

@Component({
  selector: 'app-profile',
  imports: [CommonModule, FormsModule, RouterLink, TopUpModalComponent],
  templateUrl: './profile.html',
  styleUrl: './profile.css',
  standalone: true
})
export class Profile implements OnInit {
  user: User | null = null;
  libraryGames: Game[] = [];
  isLoadingLibrary = true;
  isEditMode = false;
  isSaving = false;
  showTopUp = false;
  isOwnProfile = false;
  viewedUserId: number | null = null;

  editData = { name: '', profile_picture: '', bio: '', is_public: true };
  saveError = '';
  saveSuccess = '';
  isPrivateProfile = false;

  constructor(
    public authService: AuthService,
    private libraryService: LibraryService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    const userIdParam = this.route.snapshot.paramMap.get('id');
    
    if (userIdParam) {
      // Viewing another user's profile
      this.viewedUserId = +userIdParam;
      this.isOwnProfile = false;
      this.loadUserProfile(this.viewedUserId);
    } else {
      // Viewing own profile
      if (!this.authService.isLoggedIn) {
        this.router.navigate(['/login']);
        return;
      }
      this.isOwnProfile = true;
      this.authService.getCurrentUser().subscribe({
        next: (res) => {
          this.user = res.user;
          this.authService.updateCurrentUser(res.user);
          this.initEditData();
        }
      });
      this.loadLibrary();
    }
  }

  loadUserProfile(userId: number): void {
    this.authService.getUserById(userId).subscribe({
      next: (res) => {
        this.user = res.user;
        this.isPrivateProfile = false;
        // Load user's library if profile is public
        this.loadUserLibrary(userId);
      },
      error: (err) => {
        if (err.status === 403) {
          // Private profile
          this.isPrivateProfile = true;
          this.user = err.error.user;
          this.isLoadingLibrary = false;
        } else {
          this.router.navigate(['/']);
        }
      }
    });
  }

  loadUserLibrary(userId: number): void {
    this.isLoadingLibrary = true;
    this.libraryService.getUserLibrary(userId).subscribe({
      next: (res) => {
        this.libraryGames = res.data;
        this.isLoadingLibrary = false;
      },
      error: () => {
        this.libraryGames = [];
        this.isLoadingLibrary = false;
      }
    });
  }

  private initEditData(): void {
    this.editData = {
      name: this.user?.name ?? '',
      profile_picture: this.user?.profile_picture ?? '',
      bio: this.user?.bio ?? '',
      is_public: this.user?.is_public ?? true
    };
  }

  loadLibrary(): void {
    this.isLoadingLibrary = true;
    this.libraryService.getLibrary().subscribe({
      next: (res) => {
        this.libraryGames = res.data;
        this.isLoadingLibrary = false;
      },
      error: () => { this.isLoadingLibrary = false; }
    });
  }

  startEdit(): void {
    this.initEditData();
    this.isEditMode = true;
    this.saveError = '';
    this.saveSuccess = '';
  }

  cancelEdit(): void {
    this.isEditMode = false;
    this.saveError = '';
  }

  saveProfile(): void {
    this.isSaving = true;
    this.saveError = '';
    this.saveSuccess = '';
    this.authService.updateProfile(this.editData).subscribe({
      next: (res) => {
        this.user = res.user;
        this.authService.updateCurrentUser(res.user);
        this.isEditMode = false;
        this.saveSuccess = 'Profil sikeresen mentve!';
        this.isSaving = false;
        setTimeout(() => this.saveSuccess = '', 3000);
      },
      error: (err) => {
        this.saveError = err.error?.message || 'Mentés sikertelen.';
        this.isSaving = false;
      }
    });
  }

  onBalanceUpdated(newBalance: number): void {
    if (this.user) {
      this.user = { ...this.user, balance: newBalance };
      this.authService.updateCurrentUser(this.user);
    }
    this.showTopUp = false;
  }

  viewGame(id: number): void {
    this.router.navigate(['/game', id]);
  }

  getAvatarUrl(): string {
    return this.user?.profile_picture
      ? this.user.profile_picture
      : `https://ui-avatars.com/api/?name=${encodeURIComponent(this.user?.name ?? 'U')}&background=6366f1&color=fff&size=128`;
  }
}
