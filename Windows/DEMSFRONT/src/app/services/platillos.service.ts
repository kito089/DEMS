import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface MenuItem {
  idPlatillo: number;
  nombre: string;
  precio: number;
}

export interface MenuApiResponse {
  [categoria: string]: MenuItem[];
}

@Injectable({
  providedIn: 'root',
})
export class PlatillosService {
  private apiUrl = 'http://localhost:3000/Platillos';

  constructor(private http: HttpClient) {}

  getMenu(): Observable<MenuApiResponse> {
    return this.http.get<MenuApiResponse>(`${this.apiUrl}/menu`);
  }

  getAll(): Observable<MenuItem[]> {
    return this.http.get<MenuItem[]>(`${this.apiUrl}`);
  }
}
