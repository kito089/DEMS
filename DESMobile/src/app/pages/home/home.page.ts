import { Component, OnInit, OnDestroy, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { IonContent } from '@ionic/angular/standalone';
import { PageBodyComponent } from '../../layout/page-body/page-body.component';
import { PageHeaderHomeComponent } from '../../layout/page-header-home/page-header-home.component';
import { QuickActionTileComponent } from '../../components/quick-action-tile/quick-action-tile.component';
import { OrderActiveCardComponent } from '../../components/order-active-card/order-active-card.component';
import { ApiService } from '../../services/api.service';
import { Pedido } from 'src/app/models/pedido.model';
import { firstValueFrom, Subscription } from 'rxjs';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-home',
  standalone: true,
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  imports: [
    CommonModule,
    IonContent,
    PageBodyComponent,
    PageHeaderHomeComponent,
    QuickActionTileComponent,
    OrderActiveCardComponent,
  ],
})
export class HomePage implements OnInit, OnDestroy {

  pedidos: Pedido[] = [];
  pedidosReady: Pedido[] = [];
  pedidosPending: Pedido[] = [];
  sub!: Subscription;
  trabajador: string = '';

  constructor(private pedidoService: ApiService) { }

  actualizarListas() {
    this.pedidosReady = this.pedidos.filter(p => p.estado === 'Listo');
    this.pedidosPending = this.pedidos.filter(p => p.estado === 'Proceso');
  }

  async ngOnInit() {
    const trabajadorData = localStorage.getItem('trabajador');
    if (trabajadorData) {
      const trabajadorObj = JSON.parse(trabajadorData);
      this.trabajador = trabajadorObj.Nombre || '';
    }

    try {
      const pedidos: any = await firstValueFrom(this.pedidoService.get('/Pedidos/'));
      console.log('Pedidos recibidos:', JSON.stringify(pedidos));

      this.pedidos = pedidos.map((p: any) => {
        // tomamos directamente los platillos
        const items = p.Platillos || [];
        // calculamos subtotal sumando los precios
        const subtotal = items.reduce((acc: number, item: any) => acc + (item.Precio || 0), 0);

        return {
          id: p.idPedido,
          folio: p.idPedido.toString(),
          mesa: p.NoMesa?.toString(),
          total: subtotal,   // subtotal calculado
          items: items,      // array de platillos
          estado: p.Estado || 'Proceso'
        };
      });

      console.log('Pedidos mapeados:', JSON.stringify(this.pedidos));
      this.actualizarListas();

    } catch (err) {
      console.error('Error cargando pedidos:', err);
    }

    this.sub = this.pedidoService.escucharEventos().subscribe({
      next: (evento: any) => {
        console.log('Evento SSE recibido:', evento);
        this.actualizarPedido(evento);
      },
      error: (err) => console.error('Error SSE:', err)
    });
  }

  actualizarPedido(evento: any) {
    this.pedidos = this.pedidos.map(p =>
      p.id === evento.pedidoId
        ? { ...p, estado: evento.estado }
        : p
    );

    this.actualizarListas();
  }

  ngOnDestroy() {
    this.sub?.unsubscribe();
  }
}