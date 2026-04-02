import { Component, OnInit, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HeaderComponent } from '../../components/headerAdmin/headerComponent';

export interface Pedido {
  id: number;
  mesa: number;
  numero: string;
  estado: 'Pendiente' | 'Listo' | 'Entregado';
  items: string[];
  hora: string;
  total: number;
}

@Component({
  selector: 'app-cocina',
  standalone: true,
  imports: [CommonModule, HeaderComponent],
  templateUrl: './cocina.html',
  styleUrls: ['./cocina.css'],
})
export class CocinaComponent implements OnInit, OnDestroy {
  isLoading    = true;
  errorMessage = '';
  pedidos: Pedido[] = [];

  private sseUrl    = 'http://localhost:3000/sse/events';
  private apiUrl    = 'http://localhost:3000/Pedidos';
  private eventSource?: EventSource;

  constructor(private cdr: ChangeDetectorRef) {} // para forzar detección de cambios

  ngOnInit(): void {
    this.cargarPedidos();
    this.conectarSSE();
  }

  ngOnDestroy(): void {
    this.eventSource?.close();
  }

  cargarPedidos(): void {
    this.isLoading = true;
    fetch(this.apiUrl)
      .then(r => r.json())
      .then(data => {
        console.log('Pedidos recibidos desde backend:', data);

        this.pedidos = data
          .filter((p: any) => p.Estado === 'Proceso') // solo los activos
          .map((p: any) => ({
            id: p.idPedido,
            mesa: p.NoMesa ?? 0,
            numero: String(p.idPedido),
            estado: 'Pendiente' as const,
            items: p.Platillos ?? [],
            hora: p.Fecha ?? '',
            total: 0
          }));

        this.isLoading = false;
        this.cdr.detectChanges(); // fuerza el render
      })
      .catch(e => {
        this.errorMessage = 'Error al cargar pedidos.';
        this.isLoading    = false;
        console.error(e);
      });
  }

  conectarSSE(): void {
    this.eventSource = new EventSource(this.sseUrl);

    this.eventSource.addEventListener('nuevo_pedido', (e: MessageEvent) => {
      const pedido: Pedido = JSON.parse(e.data);
      const existe = this.pedidos.find(p => p.id === pedido.id);
      if (!existe) this.pedidos.unshift(pedido);
      this.cdr.detectChanges(); // 👈
    });

    this.eventSource.addEventListener('pedidoListo', (e: MessageEvent) => {
      const { pedidoId } = JSON.parse(e.data);
      this.pedidos = this.pedidos.map(p =>
        p.id == pedidoId ? { ...p, estado: 'Listo' } : p
      );
      this.cdr.detectChanges(); // 👈
    });

    this.eventSource.addEventListener('pedido_finalizado', (e: MessageEvent) => {
      const { id } = JSON.parse(e.data);
      this.pedidos = this.pedidos.filter(p => p.id != id);
      this.cdr.detectChanges(); // 👈
    });

    this.eventSource.addEventListener('pedido_cancelado', (e: MessageEvent) => {
      const { id } = JSON.parse(e.data);
      this.pedidos = this.pedidos.filter(p => p.id != id);
      this.cdr.detectChanges(); // 👈
    });

    this.eventSource.onerror = () => {
      console.warn('SSE desconectado, reconectando en 3s...');
      this.eventSource?.close();
      setTimeout(() => this.conectarSSE(), 3000);
    };
  }

  marcarLista(pedido: Pedido): void {
    fetch(`${this.apiUrl}/${pedido.id}/ready`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
    })
    .then(() => {
      pedido.estado = 'Listo';
      this.cdr.detectChanges(); // 👈
    })
    .catch(e => console.error('Error al marcar como listo:', e));
  }

  entregar(pedido: Pedido): void {
    fetch(`${this.apiUrl}/${pedido.id}/finalizar`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
    })
    .then(() => {
      this.pedidos = this.pedidos.filter(p => p.id !== pedido.id);
      this.cdr.detectChanges(); // 👈
    })
    .catch(e => console.error('Error al finalizar pedido:', e));
  }
}