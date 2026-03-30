import { HttpClient } from '@angular/common/http';
import { ConfigService } from './config.service';
import { firstValueFrom } from 'rxjs';
import { first, Observable, Subject } from 'rxjs';
import { Injectable } from '@angular/core';
import { Pedido } from '../models/pedido.model';
import { from } from 'rxjs';
import { switchMap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  constructor(
    private http: HttpClient,
    private config: ConfigService
  ) { }

  post(endpoint: string, body: any) {
    return from(this.config.getApiUrl()).pipe(
      switchMap(baseUrl => {
        console.log('Realizando POST a:', `${baseUrl}${endpoint}`, 'con body:', body);
        return this.http.post(`${baseUrl}${endpoint}`, body, {
          observe: 'response'
        });
      })
    );
  }

  get(endpoint: string) {
    return from(this.config.getApiUrl()).pipe(
      switchMap(baseUrl => {
        console.log('Realizando GET a:', `${baseUrl}${endpoint}`);
        return this.http.get(`${baseUrl}${endpoint}`);
      })
    );
  }

  put(endpoint: string, body: any) {
    return from(this.config.getApiUrl()).pipe(
      switchMap(baseUrl => {
        console.log('Realizando PUT a:', `${baseUrl}${endpoint}`, 'con body:', body);
        return this.http.put(`${baseUrl}${endpoint}`, body, {
          observe: 'response'
        });
      })
    );
  }

  escucharEventos(): Observable<any> {
    return new Observable(observer => {
      this.config.getApiUrl().then(baseUrl => {
        const evtSource = new EventSource(`${baseUrl}/sse/events`);

        evtSource.onmessage = (event: MessageEvent) => {
          try {
            const data = JSON.parse(event.data);
            observer.next(data);
          } catch (err) {
            console.error('Error parseando evento SSE:', err, event.data);
          }
        };

        evtSource.onerror = (err) => {
          console.error('SSE error:', err);
          observer.error(err);
          evtSource.close(); // opcional: cerrar al error grave
        };

        return () => {
          evtSource.close(); // cleanup cuando se unsubscribe
        };
      });
    });
  }
}