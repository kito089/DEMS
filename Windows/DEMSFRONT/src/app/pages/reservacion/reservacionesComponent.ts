import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HeaderComponent } from '../../components/headerAdmin/headerComponent';
import { ReservacionesService, Reservacion } from '../../services/reservacion.service';

@Component({
  selector: 'app-reservaciones',
  standalone: true,
  imports: [CommonModule, FormsModule, HeaderComponent],
  templateUrl: './reservacion.html',  // ← sin .component y sin la s
  styleUrls: ['./reservacion.css'],   // ← sin .component y sin la s
})
export class ReservacionesComponent implements OnInit {

  reservaciones: Reservacion[] = [];
  proximas:      Reservacion[] = [];
  isLoading      = false;
  errorMessage   = '';

  // Modal
  mostrarModal = false;
  modoEdicion  = false;
  editandoId: number | null = null;

  form: Reservacion = this.formVacio();

  // idTrabajador hardcoded por ahora — reemplázalo con tu auth
  private readonly ID_TRABAJADOR = 1;

  constructor(private svc: ReservacionesService) {}

  ngOnInit(): void {
    this.cargarDatos();
  }

  cargarDatos(): void {
    this.isLoading = true;

    this.svc.getAll().subscribe({
      next: (data) => {
        this.reservaciones = data;
        this.isLoading = false;
      },
      error: (e) => {
        this.errorMessage = 'Error al cargar reservaciones.';
        this.isLoading = false;
        console.error(e);
      },
    });

    this.svc.getProximas().subscribe({
      next: (data) => (this.proximas = data),
      error: (e) => console.error('Error proximas:', e),
    });
  }

  // ── Modal ──────────────────────────────────────────────
  abrirModal(): void {
    this.modoEdicion  = false;
    this.editandoId   = null;
    this.form         = this.formVacio();
    this.mostrarModal = true;
  }

  editar(r: Reservacion): void {
    this.modoEdicion  = true;
    this.editandoId   = r.idReservacion!;
    this.form = {
      NombreCliente: r.NombreCliente,
      Telefono:      r.Telefono,
      Correo:        r.Correo,
      Fecha:         r.Fecha?.split('T')[0], // normaliza fecha ISO
      NoPersonas:    r.NoPersonas,
      Estado:        r.Estado ?? 'Activa',
    };
    this.mostrarModal = true;
  }

  guardar(): void {
    if (this.modoEdicion && this.editandoId !== null) {
      this.svc.update(this.editandoId, this.form).subscribe({
        next: () => { this.cargarDatos(); this.cerrarModal(); },
        error: (e) => { this.errorMessage = 'Error al actualizar.'; console.error(e); },
      });
    } else {
      const payload: Reservacion = {
        ...this.form,
        idTrabajador: this.ID_TRABAJADOR,
      };
      this.svc.create(payload).subscribe({
        next: () => { this.cargarDatos(); this.cerrarModal(); },
        error: (e) => { this.errorMessage = 'Error al crear.'; console.error(e); },
      });
    }
  }

  eliminar(r: Reservacion): void {
    if (!confirm(`¿Eliminar reservación de ${r.NombreCliente}?`)) return;
    this.svc.delete(r.idReservacion!).subscribe({
      next: () => this.cargarDatos(),
      error: (e) => { this.errorMessage = 'Error al eliminar.'; console.error(e); },
    });
  }

  cerrarModal(): void {
    this.mostrarModal = false;
    this.errorMessage = '';
  }

  formVacio(): Reservacion {
    return {
      NombreCliente: '',
      Telefono:      '',
      Correo:        '',
      Fecha:         '',
      NoPersonas:    1,
      Estado:        'Activa',
    };
  }
}