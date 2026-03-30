import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Trabajador {
  idTrabajador: number;
  Nombre: string;
  Activo: number;
  Rol: any;
}

@Injectable({
  providedIn: 'root'
})
export class TrabajadoresService {
  private apiUrl = 'http://localhost:3000/Trabajadores';

  constructor(private http: HttpClient) {}

  getAll(): Observable<Trabajador[]> {
    return this.http.get<Trabajador[]>(`${this.apiUrl}/structure`);
  }

  create(data: { Nombre: string; Contra: string; idRol: number }): Observable<any> {
    return this.http.post(`${this.apiUrl}`, data);
  }

  update(id: number, data: { Nombre: string; Contra?: string; idRol: number }): Observable<any> {
    return this.http.put(`${this.apiUrl}/${id}`, data);
  }

  delete(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }
}