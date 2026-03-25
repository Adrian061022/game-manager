import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { Game } from '../models/game.model';

@Injectable({
  providedIn: 'root'
})
export class LibraryService {
  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}

  getLibrary(): Observable<{ data: Game[] }> {
    return this.http.get<{ data: Game[] }>(`${this.apiUrl}/library`);
  }

  getUserLibrary(userId: number): Observable<{ data: Game[] }> {
    return this.http.get<{ data: Game[] }>(`${this.apiUrl}/users/${userId}/library`);
  }

  purchase(gameId: number): Observable<{ message: string; data: Game; new_balance: number }> {
    return this.http.post<{ message: string; data: Game; new_balance: number }>(
      `${this.apiUrl}/library/purchase/${gameId}`, {}
    );
  }

  checkOwnership(gameId: number): Observable<{ owns: boolean }> {
    return this.http.get<{ owns: boolean }>(`${this.apiUrl}/library/check/${gameId}`);
  }

  addFunds(amount: number): Observable<{ message: string; new_balance: number }> {
    return this.http.post<{ message: string; new_balance: number }>(
      `${this.apiUrl}/library/add-funds`, { amount }
    );
  }
}
