import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular/standalone';
import { IonicModule } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { ApiService } from 'src/app/services/api.service';

@Component({
  selector: 'app-seleccionar-platillo',
  standalone: true,
  templateUrl: './agr-prod.component.html',
  styleUrls: ['./agr-prod.component.scss'],
  imports: [
    CommonModule,
    IonicModule
  ],
})
export class SeleccionarPlatilloComponent implements OnInit {

  constructor(private modalCtrl: ModalController, private api: ApiService) { }

  platillos: any[] = [];

  async ngOnInit() {
    await this.cargarPlatillos();
  }

  async cargarPlatillos() {
    try {
      const data = await this.api.get('/Platillos/completo') as any[];
      this.platillos = data.map((item: any) => ({
        id: item.id,
        name: item.nombre,
        tipo: item.tipo,
        precio: item.precio,
        img: 'assets/pedidosAssets/platillo.png'
      }));
    } catch (error) {
      console.error('Error al cargar platillos:', error);
    }
  }

  cerrar() {
    this.modalCtrl.dismiss();
  }

  seleccionar(item: any) {
    this.modalCtrl.dismiss(item);
  }
}