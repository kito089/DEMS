import { Component, OnInit, OnDestroy, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { IonContent } from '@ionic/angular/standalone';
import { PageBodyComponent } from '../../layout/page-body/page-body.component';
import { PageHeaderHomeComponent } from '../../layout/page-header-home/page-header-home.component';
import { QuickActionTileComponent } from '../../components/quick-action-tile/quick-action-tile.component';
import { OrderActiveCardComponent } from '../../components/order-active-card/order-active-card.component';
import { ApiService } from '../../services/api.service';
import { Pedido } from 'src/app/models/pedido.model';
import { Subscription } from 'rxjs';
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
    this.pedidosReady = this.pedidos.filter(p => p.estado === 'ready');
    this.pedidosPending = this.pedidos.filter(p => p.estado === 'pending');
  }

  async ngOnInit() {
    const data = await this.pedidoService.obtenerPedidos();
    const trabajadorData = localStorage.getItem('trabajador');
    if (trabajadorData) {
      const trabajadorObj = JSON.parse(trabajadorData);
      this.trabajador = trabajadorObj.Nombre || '';
    }

    this.pedidos = [...data];
    this.actualizarListas();

    this.sub = this.pedidoService.escucharEventos().subscribe(evento => {
      this.actualizarPedido(evento);
    });

    this.pedidoService.simularEvento();
  }

  actualizarPedido(evento: any) {
    // 🔥 NO mutar → crear nuevo array
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