import { HttpClient } from '@angular/common/http';
import { ConfigService } from './config.service';
import { firstValueFrom } from 'rxjs';
import { first, Observable, Subject } from 'rxjs';
import { Injectable } from '@angular/core';
import { Pedido } from '../models/pedido.model';

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  constructor(
    private http: HttpClient,
    private config: ConfigService
  ) { }

  private eventos$ = new Subject<any>();

  private pedidos: Pedido[] = [
    {
      id: 1,
      folio: '012',
      mesa: '3',
      total: 330,
      items: ['Tacos', 'Refresco', 'Sopa', 'Postre'],
      estado: 'pending'
    },
    {
      id: 2,
      folio: '013',
      mesa: '4',
      total: 240,
      items: ['Pizza', 'Refresco'],
      estado: 'ready'
    }
  ];

  async post(endpoint: string, body: any) {
    const baseUrl = await this.config.getApiUrl();
    return this.http.post(`${baseUrl}${endpoint}`, body);
  }

  async get(endpoint: string) {
    const baseUrl = await this.config.getApiUrl();
    console.log('Realizando GET a:', `${baseUrl}${endpoint}`);
    return firstValueFrom(this.http.get(`${baseUrl}${endpoint}`));
  }

  obtenerPedidos(): Promise<Pedido[]> {
    return new Promise(resolve => {
      setTimeout(() => {
        resolve([...this.pedidos]);
      }, 1000);
    });
  }

  escucharEventos(): Observable<any> {
    return this.eventos$.asObservable();
  }

  simularEvento() {
    setInterval(() => {
      const evento = {
        pedidoId: 1,
        estado: Math.random() > 0.5 ? 'ready' : 'pending'
      };

      console.log('🔥 Evento simulado:', evento);

      this.eventos$.next(evento);
    }, 5000); // 🔥 ahora es continuo
  }
}