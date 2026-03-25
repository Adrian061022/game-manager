import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { Category, Game, GameFilters, GameRequest, PaginatedGames } from '../models/game.model';

@Injectable({
  providedIn: 'root'
})
export class GameService {
  private apiUrl = `${environment.apiUrl}/games`;

  constructor(private http: HttpClient) { }

  getGames(page: number = 1, filters: GameFilters = {}): Observable<PaginatedGames> {
    let params = new HttpParams().set('page', page.toString());
    if (filters.search)      params = params.set('search', filters.search);
    if (filters.category_id) params = params.set('category_id', filters.category_id.toString());
    if (filters.sort_by)     params = params.set('sort_by', filters.sort_by);
    if (filters.sort_order)  params = params.set('sort_order', filters.sort_order);
    if (filters.min_price != null && filters.min_price !== '') params = params.set('min_price', filters.min_price.toString());
    if (filters.max_price != null && filters.max_price !== '') params = params.set('max_price', filters.max_price.toString());
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