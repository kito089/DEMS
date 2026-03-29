import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HeaderComponent } from '../../components/headerAdmin/headerComponent';
import { interval, Subscription } from 'rxjs';

// ── Interfaces ──────────────────────────────────────────────
export interface Pedido {
  id: number;
  mesa: number;
  numero: string;
  estado: 'Pendiente' | 'Listo' | 'Entregado';
  items: string[];
  hora: string;
  total: number;
}

// ── Componente ───────────────────────────────────────────────
@Component({
  selector: 'app-cocina',
  standalone: true,
  imports: [CommonModule, HeaderComponent],
  templateUrl: './cocina.html',
  styleUrls: ['./cocina.css'],
})
export class CocinaComponent implements OnInit, OnDestroy {
  isLoading = false;
  errorMessage = '';

  pedidos: Pedido[] = [
    {
      id: 1,
      mesa: 1,
      numero: '003',
      estado: 'Pendiente',
      items: ['2 Enchiladas verdes', '1 Pozole rojo', '2 Agua de sabor'],
      hora: '14:05',
      total: 210,
    },
    {
      id: 2,
      mesa: 5,
      numero: '004',
      estado: 'Pendiente',
      items: ['2 Enchiladas rojas', '1 Tacos dorados', '2 Tostadas Mixtas'],
      hora: '14:42',
      total: 310,
    },
    {
      id: 3,
      mesa: 4,
      numero: '006',
      estado: 'Listo',
      items: ['2 Flautas', '1 Pozole verde', '2 Coca Cola'],
      hora: '15:05',
      total: 190,
    },
    {
      id: 4,
      mesa: 3,
      numero: '007',
      estado: 'Pendiente',
      items: ['3 Enchiladas rojas', '2 Tacos dorados', '3 Tostadas Mixtas'],
      hora: '16:42',
      total: 420,
    },
  ];

  private pollingSubscription?: Subscription;
  private readonly POLLING_INTERVAL = 15_000;

  ngOnInit(): void {
    // Cuando conectes el servicio real, descomenta esto:
    // this.cargarPedidos();
    // this.pollingSubscription = interval(this.POLLING_INTERVAL)
    //   .pipe(switchMap(() => this.pedidosService.getPedidosActivos()))
    //   .subscribe({ next: (data) => (this.pedidos = data) });
  }

  ngOnDestroy(): void {
    this.pollingSubscription?.unsubscribe();
  }

  get pedidosActivos(): Pedido[] {
    return this.pedidos.filter((p) => p.estado !== 'Entregado');
  }

  marcarLista(pedido: Pedido): void {
    pedido.estado = 'Listo';
  }

  entregar(pedido: Pedido): void {
    // Quita el pedido de la vista al entregarlo
    this.pedidos = this.pedidos.filter((p) => p.id !== pedido.id);
  }
}