import { Component, EventEmitter, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { LibraryService } from '../../services/library.service';

type CardStep = 'form' | 'processing' | 'success';

@Component({
  selector: 'app-top-up-modal',
  imports: [CommonModule, FormsModule],
  templateUrl: './top-up-modal.html',
  styleUrl: './top-up-modal.css',
  standalone: true
})
export class TopUpModalComponent {
  @Output() close = new EventEmitter<void>();
  @Output() success = new EventEmitter<number>();

  step: CardStep = 'form';
  errorMessage = '';

  amount = 5000;
  presets = [1000, 2500, 5000, 10000, 20000];

  card = {
    number: '',
    name: '',
    expiry: '',
    cvv: ''
  };

  constructor(private libraryService: LibraryService) {}

  selectPreset(value: number): void {
    this.amount = value;
  }

  formatCardNumber(event: Event): void {
    const input = event.target as HTMLInputElement;
    let val = input.value.replace(/\D/g, '').substring(0, 16);
    this.card.number = val.replace(/(.{4})/g, '$1 ').trim();
  }

  formatExpiry(event: Event): void {
    const input = event.target as HTMLInputElement;
    let val = input.value.replace(/\D/g, '').substring(0, 4);
    if (val.length > 2) {
      val = val.substring(0, 2) + '/' + val.substring(2);
    }
    this.card.expiry = val;
  }

  isFormValid(): boolean {
    const rawNumber = this.card.number.replace(/\s/g, '');
    return (
      this.amount >= 100 &&
      rawNumber.length === 16 &&
      this.card.name.trim().length >= 3 &&
      /^\d{2}\/\d{2}$/.test(this.card.expiry) &&
      /^\d{3,4}$/.test(this.card.cvv)
    );
  }

  submit(): void {
    if (!this.isFormValid()) return;
    this.step = 'processing';
    this.errorMessage = '';

    // Simulate 2s processing delay, then call real API
    setTimeout(() => {
      this.libraryService.addFunds(this.amount).subscribe({
        next: (res) => {
          this.step = 'success';
          setTimeout(() => this.success.emit(res.new_balance), 1800);
        },
        error: (err) => {
          this.errorMessage = err.error?.message || 'A feltöltés sikertelen.';
          this.step = 'form';
        }
      });
    }, 2000);
  }

  dismiss(): void {
    this.close.emit();
  }
}
