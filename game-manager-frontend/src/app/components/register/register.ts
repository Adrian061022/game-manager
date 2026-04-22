import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { RegisterRequest } from '../../models/user.model';

@Component({
  selector: 'app-register',
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './register.html',
  styleUrl: './register.css',
  standalone: true
})
export class Register {
  userData: RegisterRequest = {
    name: '',
    email: '',
    password: '',
    password_confirmation: ''
  };
  errorMessage: string = '';
  successMessage: string = '';
  isLoading: boolean = false;

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  onSubmit(): void {
    this.errorMessage = '';
    this.successMessage = '';
    this.isLoading = true;

    // Check if passwords match
    if (this.userData.password !== this.userData.password_confirmation) {
      this.errorMessage = 'A jelszavak nem egyeznek.';
      this.isLoading = false;
      return;
    }

    this.authService.register(this.userData).subscribe({
      next: (response) => {
        console.log('Registration successful', response);
        this.successMessage = 'Sikeres regisztráció! Átirányítás...';
        setTimeout(() => {
          this.router.navigate(['/']);
        }, 1000);
      },
      error: (error) => {
        console.error('Registration error', error);
        this.errorMessage = error.error?.message || 'Regisztráció sikertelen. Kérjük, próbáld újra.';
        if (error.error?.errors) {
          // Handle Laravel validation errors
          const errors = Object.values(error.error.errors).flat();
          this.errorMessage = errors.join(', ');
        }
        this.isLoading = false;
      },
      complete: () => {
        this.isLoading = false;
      }
    });
  }
}