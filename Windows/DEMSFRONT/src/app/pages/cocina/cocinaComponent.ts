import { Component, OnInit, OnDestroy } from '@angular/core';
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

  private sseUrl    = 'http://localhost:3000/events'; // ← tu URL del backend
  private apiUrl    = 'http://localhost:3000/Pedidos';
  private eventSource?: EventSource;

  ngOnInit(): void {
    this.cargarPedidos();
    this.conectarSSE();
  }

  ngOnDestroy(): void {
    this.eventSource?.close();
  }

  // ── Carga inicial ────────────────────────────────────
  // ── Carga inicial ────────────────────────────────────
cargarPedidos(): void {
  this.isLoading = true;
  fetch(this.apiUrl)
    .then(r => r.json())
    .then(data => {
      console.log('Pedidos recibidos desde backend:', data);

      // Adaptamos la respuesta a la interfaz Pedido
      this.pedidos = data.map((p: any) => ({
        id: p.id,
        mesa: p.mesa,
        numero: p.numero ?? '',
        estado: p.estado ?? 'Pendiente',
        items: p.items ?? p.productos ?? [],   // ← fallback si backend usa "productos"
        hora: p.hora ?? p.horaPedido ?? '',
        total: p.total ?? p.monto ?? 0
      }));

      this.isLoading = false;
    })
    .catch(e => {
      this.errorMessage = 'Error al cargar pedidos.';
      this.isLoading    = false;
      console.error(e);
    });
}
conectarSSE(): void {
  this.eventSource = new EventSource(this.sseUrl);

  // Nuevo pedido → aparece en cocina
  this.eventSource.addEventListener('nuevo_pedido', (e: MessageEvent) => {
    const pedido: Pedido = JSON.parse(e.data);
    const existe = this.pedidos.find(p => p.id === pedido.id);
    if (!existe) this.pedidos.unshift(pedido);
  });

  // ✅ "pedidoListo" (camelCase, así lo manda tu backend)
  this.eventSource.addEventListener('pedidoListo', (e: MessageEvent) => {
    const { pedidoId } = JSON.parse(e.data);
    this.pedidos = this.pedidos.map(p =>
      p.id == pedidoId ? { ...p, estado: 'Listo' } : p
    );
  });

  // Pedido finalizado → sale de cocina
  this.eventSource.addEventListener('pedido_finalizado', (e: MessageEvent) => {
    const { id } = JSON.parse(e.data);
    this.pedidos = this.pedidos.filter(p => p.id != id);
  });

  // Pedido cancelado → sale de cocina
  this.eventSource.addEventListener('pedido_cancelado', (e: MessageEvent) => {
    const { id } = JSON.parse(e.data);
    this.pedidos = this.pedidos.filter(p => p.id != id);
  });

  this.eventSource.onerror = () => {
    console.warn('SSE desconectado, reconectando en 3s...');
    this.eventSource?.close();
    setTimeout(() => this.conectarSSE(), 3000);
  };
}

marcarLista(pedido: Pedido): void {
  fetch(`${this.apiUrl}/${pedido.id}/ready`, {  // ← /ready no /estado
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
  })
  .then(() => { pedido.estado = 'Listo'; })
  .catch(e => console.error('Error al marcar como listo:', e));
}

entregar(pedido: Pedido): void {
  fetch(`${this.apiUrl}/${pedido.id}/finalizar`, {  // ← /finalizar
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
  })
  .then(() => {
    this.pedidos = this.pedidos.filter(p => p.id !== pedido.id);
  })
  .catch(e => console.error('Error al finalizar pedido:', e));
} 
}