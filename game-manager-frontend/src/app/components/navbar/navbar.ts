import { Component } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-navbar',
  imports: [CommonModule, RouterLink, RouterLinkActive],
  templateUrl: './navbar.html',
  styleUrl: './navbar.css',
  standalone: true
})
export class Navbar {
  constructor(
    public authService: AuthService,
    private router: Router
  ) {}

  getAvatarUrl(): string {
    const user = this.authService.currentUserValue;
    return user?.profile_picture
      ? user.profile_picture
      : `https://ui-avatars.com/api/?name=${encodeURIComponent(user?.name ?? 'U')}&background=6366f1&color=fff&size=64`;
  }

  logout(): void {
    this.authService.logout().subscribe({
      next: () => {
        this.router.navigate(['/login']);
      },
      error: () => {
        localStorage.removeItem('token');
        localStorage.removeItem('currentUser');
        this.router.navigate(['/login']);
      }
    });
  }
}
