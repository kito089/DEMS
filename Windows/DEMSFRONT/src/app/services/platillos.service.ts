import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

declare const window: any;

export interface Categoria {
  idCategoriasPlatillos: number;
  Nombre: string;
}

@Injectable({ providedIn: 'root' })
export class PlatillosService {

  // Lee la URL del backend desde config.js (escrita por el instalador)
  private get apiUrl(): string {
    return window.APP_CONFIG?.API_URL || 'http://localhost:3000';
  }

  constructor(private http: HttpClient) {}

  getCompleto(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/Platillos/completo`);
  }

  getById(id: number): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/Platillos/${id}`);
  }

  createPlatillo(body: any): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/Platillos`, body);
  }

  updatePlatillo(id: number, body: any): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/Platillos/${id}`, body);
  }

  deletePlatillo(id: number): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/Platillos/${id}`);
  }

  // Sube la imagen de un platillo después de crearlo o editarlo.
  // El backend la guarda en images/platillos/{id}.{ext} y actualiza la BD.
  uploadImagen(id: number, file: File): Observable<any> {
    const formData = new FormData();
    formData.append('imagen', file);
    return this.http.post<any>(`${this.apiUrl}/Platillos/${id}/imagen`, formData);
  }

  listenSSE(): Observable<any> {
    return new Observable(observer => {
      const eventSource = new EventSource(`${this.apiUrl}/sse`);

      eventSource.onmessage = (event) => {
        try {
          observer.next({ type: 'message', data: JSON.parse(event.data) });
        } catch {
          observer.next({ type: 'message', data: event.data });
        }
      };

      eventSource.onerror = (err) => observer.error(err);

      // Limpieza al destruir el componente
      return () => eventSource.close();
    });
  }
}