import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { Category, Game, GameRequest, PaginatedGames } from '../models/game.model';

@Injectable({
  providedIn: 'root'
})
export class GameService {
  private apiUrl = `${environment.apiUrl}/games`;

  constructor(private http: HttpClient) { }

  getGames(page: number = 1): Observable<PaginatedGames> {
    const params = new HttpParams().set('page', page.toString());
    return this.http.get<PaginatedGames>(this.apiUrl, { params });
  }

  getGame(id: number): Observable<{ data: Game }> {
    return this.http.get<{ data: Game }>(`${this.apiUrl}/${id}`);
  }

  createGame(game: GameRequest): Observable<{ data: Game }> {
    return this.http.post<{ data: Game }>(this.apiUrl, game);
  }

  updateGame(id: number, game: GameRequest): Observable<{ data: Game }> {
    return this.http.put<{ data: Game }>(`${this.apiUrl}/${id}`, game);
  }

  deleteGame(id: number): Observable<{ message: string }> {
    return this.http.delete<{ message: string }>(`${this.apiUrl}/${id}`);
  }

  getCategories(): Observable<Category[]> {
    return this.http.get<Category[]>(`${environment.apiUrl}/categories`);
  }
}