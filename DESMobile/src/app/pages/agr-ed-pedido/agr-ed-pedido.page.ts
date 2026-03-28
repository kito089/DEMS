import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonContent } from '@ionic/angular/standalone';
import { PageBodyComponent } from '../../layout/page-body/page-body.component';
import { PageHeaderCreamComponent } from '../../layout/page-header-cream/page-header-cream.component';
import { BottomNavComponent } from '../../layout/bottom-nav/bottom-nav.component';
import { ElevatedPanelComponent } from '../../components/elevated-panel/elevated-panel.component';
import { ChoiceSplitButtonsComponent } from '../../components/choice-split-buttons/choice-split-buttons.component';
import { MesaInputRowComponent } from '../../components/mesa-input-row/mesa-input-row.component';
import { ToolbarIconButtonComponent } from '../../components/toolbar-icon-button/toolbar-icon-button.component';
import { DishEditRowComponent } from '../../components/dish-edit-row/dish-edit-row.component';
import { DividerLineComponent } from '../../components/divider-line/divider-line.component';
import { PrimaryButtonComponent } from '../../components/primary-button/primary-button.component';
import { ModalController } from '@ionic/angular/standalone';
import { IonicModule } from '@ionic/angular';
import { SeleccionarPlatilloComponent } from '../../layout/agr-prod/agr-prod.component';

@Component({
  selector: 'app-agr-ed-pedido',
  templateUrl: './agr-ed-pedido.page.html',
  styleUrls: ['./agr-ed-pedido.page.scss'],
  standalone: true,
  imports: [
    IonicModule,
    IonContent,
    CommonModule,
    PageBodyComponent,
    PageHeaderCreamComponent,
    BottomNavComponent,
    ElevatedPanelComponent,
    ChoiceSplitButtonsComponent,
    MesaInputRowComponent,
    ToolbarIconButtonComponent,
    DishEditRowComponent,
    DividerLineComponent,
    PrimaryButtonComponent,
  ],
})
export class AgrEdPedidoPage implements OnInit {
  orderType: 'local' | 'pickup' = 'local';

  dishes = [
    { name: 'Enchiladas verdes', quantity: 2 },
    { name: 'Pozole rojo', quantity: 2 },
    { name: 'Agua de jamaica', quantity: 3 },
  ];

  constructor(private modalCtrl: ModalController) { }

  ngOnInit() { }

  async noop() {
    console.log('CLICK OK'); // 👈 agrega esto

    const modal = await this.modalCtrl.create({
      component: SeleccionarPlatilloComponent,
      breakpoints: [0, 0.5, 0.9],
      initialBreakpoint: 0.5,
      handle: true
    });

    console.log('MODAL CREADO'); // 👈

    await modal.present();

    console.log('MODAL PRESENTADO'); // 👈
  }

  onOrderTypeChange(type: 'local' | 'pickup'): void {
    this.orderType = type;
  }

  onDishMinus(index: number): void {
    if (this.dishes[index].quantity > 0) {
      this.dishes[index].quantity--;
    }
  }

  onDishPlus(index: number): void {
    this.dishes[index].quantity++;
  }
}
