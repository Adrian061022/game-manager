import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { TransactionService } from '../../../services/transaction.service';
import { AuthService } from '../../../services/auth.service';
import { Transaction } from '../../../models/transaction.model';

@Component({
  selector: 'app-transactions',
  imports: [CommonModule],
  templateUrl: './transactions.html',
  styleUrl: './transactions.css',
  standalone: true
})
export class Transactions implements OnInit {
  transactions: Transaction[] = [];
  isLoading = true;
  errorMessage = '';
  currentPage = 1;
  lastPage = 1;
  total = 0;
  selectedType: string = '';

  constructor(
    private transactionService: TransactionService,
    public authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    if (!this.authService.isAdmin) {
      this.router.navigate(['/']);
      return;
    }
    this.load();
  }

  load(): void {
    this.isLoading = true;
    this.errorMessage = '';
    this.transactionService.getTransactions(this.currentPage, this.selectedType || undefined).subscribe({
      next: (res) => {
        this.transactions = res.data;
        this.currentPage = res.current_page;
        this.lastPage = res.last_page;
        this.total = res.total;
        this.isLoading = false;
      },
      error: () => {
        this.errorMessage = 'Nem sikerült betölteni a tranzakciókat.';
        this.isLoading = false;
      }
    });
  }

  filterBy(type: string): void {
    this.selectedType = type;
    this.currentPage = 1;
    this.load();
  }

  goToPage(page: number): void {
    if (page < 1 || page > this.lastPage) return;
    this.currentPage = page;
    this.load();
  }

  formatAmount(amount: string | number): string {
    return Number(amount).toLocaleString('hu-HU') + ' Ft';
  }
}
