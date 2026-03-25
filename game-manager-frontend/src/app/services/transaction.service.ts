import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { PaginatedTransactions } from '../models/transaction.model';

@Injectable({ providedIn: 'root' })
export class TransactionService {
  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}

  getTransactions(page = 1, type?: string): Observable<PaginatedTransactions> {
    let params = new HttpParams().set('page', page.toString());
    if (type) params = params.set('type', type);
    return this.http.get<PaginatedTransactions>(`${this.apiUrl}/admin/transactions`, { params });
  }
}
