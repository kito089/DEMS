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
import { NotaModalComponent } from '../../layout/nota/nota.component';
import { ApiService } from 'src/app/services/api.service';

interface Dish {
  id?: number;
  name: string;
  quantity: number;
  price: number;
  note: string;
}

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
  noMesa: number | null = 1;
  dishes: Dish[] = [];

  constructor(private modalCtrl: ModalController, private api: ApiService) { }

  ngOnInit() { }

  onMesaChange(value: number) {
    this.noMesa = value;
  }

  onOrderTypeChange(type: 'local' | 'pickup'): void {
    this.orderType = type;

    if (type === 'pickup') {
      this.noMesa = null;
    }
  }
  async abrirPlatillos() {
    const modal = await this.modalCtrl.create({
      component: SeleccionarPlatilloComponent,
      breakpoints: [0, 0.5, 0.9],
      initialBreakpoint: 0.5,
      handle: true
    });
    await modal.present();

    const { data } = await modal.onDidDismiss();

    if (data) {
      console.log('Platillo seleccionado:', data);
      this.agregarPlatillo(data);
    }
  }

  agregarPlatillo(platillo: any) {
    const existingDish = this.dishes.find(
      (d) => d.id === platillo.id
    );

    if (existingDish) {
      existingDish.quantity++;
    } else {
      this.dishes.push({
        id: platillo.id,
        name: platillo.nombre,
        quantity: 1,
        price: platillo.precio,
        note: ''
      });
    }
  }

  async abrirNota(index: number) {
    const dish = this.dishes[index];
    if (!dish) return;
    const modal = await this.modalCtrl.create({
      component: NotaModalComponent,
      componentProps: {
        notaActual: dish.note
      },
      breakpoints: [0.2, 0.5, 0.9],
      initialBreakpoint: 0.5,
      handle: true,
      backdropDismiss: true,
      cssClass: 'nota-modal'
    });

    await modal.present();

    const { data } = await modal.onDidDismiss();

    if (data !== undefined) {
      dish.note = data;
    }
  }

  guardarPedido(): void {
    console.log(this.dishes);
    if (this.dishes.length === 0) {
      console.warn('No hay platillos en el pedido');
      alert('No hay platillos en el pedido');
      return;
    }
    if (this.orderType === 'local' && !this.noMesa) {
      alert('Debes ingresar número de mesa');
      return;
    }
    const payload = {
      TrabajadorId: 1, // cambiar cuando tenga login
      Tipo: this.orderType === 'local' ? 0 : 1,
      NoMesa: this.noMesa,
      Detalles: this.dishes.map(d => ({
        idPlatillo: d.id,
        cantidad: d.quantity,
        precio: d.price,
        nota: d.note || ''
      }))
    };
    console.log('Enviando pedido:', JSON.stringify(payload));
    this.api.post('/Pedidos', payload);
    alert('Pedido guardado correctamente');
  }

  onDishMinus(index: number): void {
    const dish = this.dishes[index];
    if (!dish) return;
    if (this.dishes[index].quantity > 1) {
      this.dishes[index].quantity--;
    } else {
      this.dishes.splice(index, 1);
    }
  }

  onDishPlus(index: number): void {
    const dish = this.dishes[index];
    if (!dish) return;
    this.dishes[index].quantity++;
  }
}
