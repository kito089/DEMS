import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject, throwError } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';

export interface Trabajador {
  idTrabajador: number;
  Nombre: string;
  Rol: string;
  RolTrabajadores_idRolTrabajadores?: number;
}

export interface LoginResponse {
  message: string;
  trabajador: Trabajador;
}

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private apiUrl = 'http://localhost:3000';
  private currentUserSubject = new BehaviorSubject<Trabajador | null>(null);
  public currentUser$ = this.currentUserSubject.asObservable();

  constructor(private http: HttpClient) {
    // Cargar usuario del localStorage si existe
    const stored = localStorage.getItem('currentUser');
    if (stored) {
      this.currentUserSubject.next(JSON.parse(stored));
    }
  }

  login(usuario: string, contraseña: string): Observable<LoginResponse> {
    return this.http
      .post<LoginResponse>(`${this.apiUrl}/Trabajadores/login`, {
        Nombre: usuario,
        Contra: contraseña,
      })
      .pipe(
        tap((response) => {
          localStorage.setItem('currentUser', JSON.stringify(response.trabajador));
          this.currentUserSubject.next(response.trabajador);
        }),
        catchError((error) => {
          return throwError(() => error);
        })
      );
  }

  getCurrentUser(): Trabajador | null {
    return this.currentUserSubject.value;
  }

  getRol(): string | null {
    const user = this.currentUserSubject.value;
    return user ? user.Rol : null;
  }

  logout(): void {
    localStorage.removeItem('currentUser');
    this.currentUserSubject.next(null);
  }

  isLoggedIn(): boolean {
    return this.currentUserSubject.value !== null;
  }
}
