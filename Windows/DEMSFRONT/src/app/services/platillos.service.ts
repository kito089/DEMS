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

export interface Categoria {
  idCategoriasPlatillos: number;
  Nombre: string;
}

@Injectable({
  providedIn: 'root',
})
export class PlatillosService {
  private apiUrl = 'http://localhost:3000/Platillos';
  private sseUrl = 'http://localhost:3000/sse/events';

  constructor(private http: HttpClient) {}

  getMenu(): Observable<MenuApiResponse> {
    return this.http.get<MenuApiResponse>(`${this.apiUrl}/menu`);
  }

  getAll(): Observable<MenuItem[]> {
    return this.http.get<MenuItem[]>(`${this.apiUrl}`);
  }

  getCompleto(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/completo`);
  }

  createPlatillo(platillo: { Nombre: string; Descripcion: string; Precio: number; idCategoria: number }): Observable<any> {
    return this.http.post(`${this.apiUrl}`, platillo);
  }

  updatePlatillo(id: number, platillo: { Nombre: string; Descripcion: string; Precio: number; idCategoria: number }): Observable<any> {
    return this.http.put(`${this.apiUrl}/${id}`, platillo);
  }

  listenSSE(): Observable<{ type: string; data: any }> {
    return new Observable(observer => {
      const eventSource = new EventSource(this.sseUrl);
      const eventos = ['nuevo_platillo', 'platillo_actualizado', 'platillo_eliminado'];
      eventos.forEach(tipo => {
        eventSource.addEventListener(tipo, (event: MessageEvent) => {
          observer.next({ type: tipo, data: JSON.parse(event.data) });
        });
      });
      eventSource.onerror = (err) => console.error('[SSE] error de conexión', err);
      return () => eventSource.close();
    });
  }
}