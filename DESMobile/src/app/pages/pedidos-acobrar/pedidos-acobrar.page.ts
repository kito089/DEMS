import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent } from '@ionic/angular/standalone';
import { PageHeaderCreamComponent } from '../../layout/page-header-cream/page-header-cream.component';
import { PageBodyComponent } from '../../layout/page-body/page-body.component';
import { BottomNavComponent } from '../../layout/bottom-nav/bottom-nav.component';
import { PedidoCobroRowComponent } from '../../components/pedido-cobro-row/pedido-cobro-row.component';

@Component({
  selector: 'app-pedidos-acobrar',
  templateUrl: './pedidos-acobrar.page.html',
  styleUrls: ['./pedidos-acobrar.page.scss'],
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    IonContent,
    PageHeaderCreamComponent,
    PageBodyComponent,
    BottomNavComponent,
    PedidoCobroRowComponent
  ]
})
export class PedidosACobrarPage implements OnInit {

  constructor() { }

  ngOnInit() {
  }

}
