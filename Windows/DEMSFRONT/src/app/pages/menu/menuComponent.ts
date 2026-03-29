import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';  
import { HeaderComponent } from '../../components/headerAdmin/headerComponent';
import { CardComponent } from '../../components/card-menu/card-menuComponent';  
import { PlatillosService, MenuApiResponse } from '../../services/platillos.service';

@Component({  
  selector: 'app-menu',
  standalone: true,
  imports: [HeaderComponent, CardComponent, CommonModule],
  templateUrl: './menu.html',
  styleUrls: ['./menu.css']
})
export class MenuComponent implements OnInit {
  categories: Array<{ nombre: string; platillos: any[] }> = [];
  isLoading = false;
  errorMessage = '';

  constructor(private platillosService: PlatillosService) {}

  ngOnInit() {
    this.loadMenu();
  }

  loadMenu() {
    console.log('[MenuComponent] loadMenu init');
    this.isLoading = true;
    this.errorMessage = '';

    this.platillosService.getMenu().subscribe({
      next: (data: MenuApiResponse) => {
        console.log('[MenuComponent] getMenu response:', data);

        const keys = Object.keys(data || {});
        if (keys.length === 0) {
          this.loadMenuDirect();
          return;
        }

        this.categories = keys.map((categoria) => ({
          nombre: categoria,
          platillos: data[categoria] || [],
        }));

        if (!this.categories.some((c) => c.platillos.length > 0)) {
          this.errorMessage = 'No hay platillos disponibles.';
        }

        this.isLoading = false;
      },
      error: (error) => {
        console.error('[MenuComponent] Error cargando menú:', error);
        this.errorMessage = 'No se pudo cargar el menú. Revisa la conexión con el servidor.';
        this.isLoading = false;
      }
    });
  }

  loadMenuDirect() {
    console.log('[MenuComponent] loadMenuDirect fallback');
    this.platillosService.getAll().subscribe({
      next: (platillos) => {
        console.log('[MenuComponent] getAll response:', platillos);

        if (!platillos || platillos.length === 0) {
          this.errorMessage = 'No hay platillos disponibles.';
        } else {
          this.categories = [{ nombre: 'Todos', platillos }];
        }

        this.isLoading = false;
      },
      error: (error) => {
        console.error('[MenuComponent] Error cargando todos los platillos:', error);
        this.errorMessage = 'No se pudo cargar el menú de platillos. Intenta nuevamente.';
        this.isLoading = false;
      }
    });
  }

  onEditar(platillo: any) {
    console.log('Editar:', platillo.nombre);
  }

  onEliminar(platillo: any) {
    console.log('Eliminar:', platillo.nombre);
  }
}
