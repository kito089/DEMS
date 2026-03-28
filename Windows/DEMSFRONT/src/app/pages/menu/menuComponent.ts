import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';  
import { HeaderComponent } from '../../components/headerAdmin/headerComponent';
import { CardComponent } from '../../components/card-menu/card-menuComponent';  

@Component({  
  selector: 'app-menu',
  standalone: true,
  imports: [HeaderComponent, CardComponent, CommonModule],  // ← CommonModule
  templateUrl: './menu.html',
  styleUrls: ['./menu.css']
})
export class MenuComponent {
  platillos = [
    { imagen: 'assets/enchiladas-rojas.png', nombre: 'Enchiladas rojas', precio: 80, descripcion: '(Rellenas de queso y/o cebolla, complementos papas con zanahoria. Queso y crema, con cama de lechuga)' },
    { imagen: 'assets/sopes.jpg', nombre: 'Sopes con carne', precio: 55, descripcion: '(Sopes con cama de frijoles, carne de su elección: pollo, puerco, res, lechuga, queso y crema)' },
    { imagen: 'assets/flautas.jpg', nombre: 'Flautas', precio: 85, descripcion: '(Rellenas de pollo, puerco, res, rajas o requesón. Queso, crema, lechuga, cebolla morada, zanahoria curtida)' },
    { imagen: 'assets/tacos-dorados.jpg', nombre: 'Tacos dorados', precio: 65, descripcion: '(Rellenos de papa o requesón. Queso, crema, lechuga, cebolla morada, zanahoria curtida)' },
    { imagen: 'assets/pozole.jpg', nombre: 'Pozole', precio: 85, descripcion: '(Pozole rojo, verde los fines de semana, con carne de su elección: maciza, surtida, cabeza)' },
    { imagen: 'assets/agua.jpg', nombre: 'Agua de sabor', precio: 30, descripcion: '(Agua de sabor natural, pregunte por el sabor que se hace al día)' },
    { imagen: 'assets/coca.jpg', nombre: 'Coca cola', precio: 30, descripcion: '(Refresco bien frío para calmar esa sed y acompañar con su comida de su elección)' },
    { imagen: 'assets/enchiladas-verdes.jpg', nombre: 'Enchiladas verdes', precio: 105, descripcion: '(Rellenas a su gusto, complementos, queso, crema, lechuga, cebolla morada, zanahoria curtida)' },
    { imagen: 'assets/chimichangas.jpg', nombre: 'Chimichangas con carne', precio: 75, descripcion: '(Burrito frito con tortilla de harina, relleno con carne de elección pollo, puerco o res)' },
    { imagen: 'assets/tostada.jpg', nombre: 'Tostada con carne', precio: 55, descripcion: '(Tostada con cama de frijoles, carne de su elección: pollo, puerco, res, lechuga, queso y crema)' },
  ];

  onEditar(platillo: any) {
    console.log('Editar:', platillo.nombre);
  }

  onEliminar(platillo: any) {
    console.log('Eliminar:', platillo.nombre);
  }
}