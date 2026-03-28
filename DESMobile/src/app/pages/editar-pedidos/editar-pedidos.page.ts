import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonContent } from '@ionic/angular/standalone';
import { PageBodyComponent } from '../../layout/page-body/page-body.component';
import { PageHeaderCreamComponent } from '../../layout/page-header-cream/page-header-cream.component';
import { BottomNavComponent } from '../../layout/bottom-nav/bottom-nav.component';
import { PrimaryButtonComponent } from '../../components/primary-button/primary-button.component';
import { PedidoSelectRowComponent } from '../../components/pedido-select-row/pedido-select-row.component';
import { DividerLineComponent } from '../../components/divider-line/divider-line.component';

@Component({
  selector: 'app-editar-pedidos',
  templateUrl: './editar-pedidos.page.html',
  styleUrls: ['./editar-pedidos.page.scss'],
  standalone: true,
  imports: [
    IonContent,
    CommonModule,
    PageBodyComponent,
    PageHeaderCreamComponent,
    BottomNavComponent,
    PrimaryButtonComponent,
    PedidoSelectRowComponent,
    DividerLineComponent,
  ],
})
export class EditarPedidosPage implements OnInit {
  constructor() {}

  ngOnInit() {}

  noop(): void {}
}
