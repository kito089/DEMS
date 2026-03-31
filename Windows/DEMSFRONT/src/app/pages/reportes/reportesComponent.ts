import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HeaderComponent } from '../../components/headerAdmin/headerComponent';

@Component({
  selector: 'app-reportes',
  standalone: true,
  imports: [HeaderComponent, CommonModule],
  templateUrl: './reportes.html',
  styleUrls: ['./reportes.css']
})
export class ReportesComponent {

  tabActiva: 'ventas' | 'historial' = 'ventas';
  filtroActivo: 'Todos' | 'Agregación' | 'Modificación' | 'Eliminación' = 'Todos';

  ventasResumen = {
    total: 1987,
    ventas: 10,
    ticketPromedio: 987,
    metodoPrincipal: 'Efectivo',
    porcentajeMetodo: 67
  };

  historialVentas = [
    { folio: 'V-001', fecha: '2026-03-02', mesa: 'Mesa 1', platillos: 'Enchiladas Verdes ×2, Agua de Jamaica ×2', metodo: 'Efectivo', total: 220 },
    { folio: 'V-002', fecha: '2026-03-02', mesa: 'Mesa 2', platillos: 'Pozole Rojo ×1, Tostadas ×1', metodo: 'Transferencia', total: 150 },
    { folio: 'V-003', fecha: '2026-03-01', mesa: 'Mesa 3', platillos: 'Sopes ×3, Flautas ×2', metodo: 'Transferencia', total: 350 },
    { folio: 'V-004', fecha: '2026-03-01', mesa: 'Mesa 5', platillos: 'Tacos dorados ×3, Coca Cola ×2', metodo: 'Efectivo', total: 290 },
  ];

  productosVendidos = [
    { posicion: 1, nombre: 'Pozole rojo', cantidad: 60, porcentaje: 100 },
    { posicion: 2, nombre: 'Enchiladas verdes', cantidad: 56, porcentaje: 93 },
    { posicion: 3, nombre: 'Enchiladas rojas', cantidad: 50, porcentaje: 83 },
    { posicion: 4, nombre: 'Flautas', cantidad: 40, porcentaje: 67 },
    { posicion: 5, nombre: 'Tacos dorados', cantidad: 20, porcentaje: 33 },
  ];

  historialCambios = [
    {
      periodo: 'Hoy',
      cambios: 1,
      items: [
        { descripcion: 'Se agregó "Burritos" al menú', usuario: 'Camila G.', tiempo: 'Hace 1 día', tipo: 'Agregación' }
      ]
    },
    {
      periodo: 'Ayer',
      cambios: 2,
      items: [
        { descripcion: 'Se modificó precio de "Pozole rojo" a $110', usuario: 'Camila G.', tiempo: 'Hace 2 días', tipo: 'Modificación' },
        { descripcion: 'Se eliminó reservación de Carlos Rodriguez', usuario: 'Camila G.', tiempo: 'Hace 3 días', tipo: 'Eliminación' }
      ]
    }
  ];

  get historialFiltrado() {
    if (this.filtroActivo === 'Todos') return this.historialCambios;
    return this.historialCambios.map(grupo => ({
      ...grupo,
      items: grupo.items.filter(i => i.tipo === this.filtroActivo)
    })).filter(grupo => grupo.items.length > 0);
  }

  getTipoClass(tipo: string): string {
    const clases: { [key: string]: string } = {
      'Agregación': 'badge-agregacion',
      'Modificación': 'badge-modificacion',
      'Eliminación': 'badge-eliminacion'
    };
    return clases[tipo] || '';
  }

  cambiarTab(tab: 'ventas' | 'historial') {
    this.tabActiva = tab;
  }

  cambiarFiltro(filtro: 'Todos' | 'Agregación' | 'Modificación' | 'Eliminación') {
    this.filtroActivo = filtro;
  }

  exportarPDF() {
    alert('Exportar a PDF — próximamente');
  }
}