import { Component, OnInit, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { HeaderComponent } from '../../components/headerAdmin/headerComponent';
import { PlatillosService, Categoria } from '../../services/platillos.service';

@Component({
  selector: 'app-registro-platillo',
  standalone: true,
  imports: [HeaderComponent, CommonModule, FormsModule],
  templateUrl: './registro-platillo-component.html',
  styleUrls: ['./registro-platillo-component.css']
})
export class RegistroPlatilloComponent implements OnInit {

  esEdicion = false;
  platilloId: number | null = null;

  platillo = {
    nombre: '',
    idCategoria: null as number | null,
    descripcion: '',
    precio: null as number | null
  };

  categorias: Categoria[] = [];
  dropdownAbierto = false;
  categoriaSeleccionada: Categoria | null = null;

  imagenPreview: string | null = null;
  imagenFile: File | null = null; // archivo real para enviar al backend

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private platillosService: PlatillosService
  ) {}

  @HostListener('document:click')
  cerrarDropdown() {
    this.dropdownAbierto = false;
  }

  ngOnInit() {
    this.categorias = [
      { idCategoriasPlatillos: 1, Nombre: 'Comida' },
      { idCategoriasPlatillos: 2, Nombre: 'Bebidas' },
      { idCategoriasPlatillos: 3, Nombre: 'Extras' }
    ];

    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.esEdicion = true;
      this.platilloId = Number(id);
      const stored = localStorage.getItem('platilloEditar');
      if (stored) {
        const p = JSON.parse(stored);
        this.platillo = {
          nombre: p.nombre,
          idCategoria: p.idCategoria,
          descripcion: p.descripcion || '',
          precio: p.precio
        };
        // Mostrar la imagen actual si existe
        if (p.imagen) {
          this.imagenPreview = p.imagen;
        }
      }
    }
  }

  toggleDropdown(event: Event) {
    event.stopPropagation();
    this.dropdownAbierto = !this.dropdownAbierto;
  }

  seleccionarCategoria(cat: Categoria) {
    this.categoriaSeleccionada = cat;
    this.platillo.idCategoria = cat.idCategoriasPlatillos;
    this.dropdownAbierto = false;
  }

  onImagenSeleccionada(event: any) {
    const archivo: File = event.target.files[0];
    if (archivo) {
      this.imagenFile = archivo; // guardar referencia al File para subirlo después
      const reader = new FileReader();
      reader.onload = (e: any) => {
        this.imagenPreview = e.target.result;
      };
      reader.readAsDataURL(archivo);
    }
  }

  guardar() {
    if (!this.platillo.nombre || !this.platillo.idCategoria || !this.platillo.precio) {
      alert('Nombre, categoría y precio son obligatorios');
      return;
    }

    const body = {
      Nombre: this.platillo.nombre,
      Descripcion: this.platillo.descripcion,
      Precio: Number(this.platillo.precio),
      idCategoria: Number(this.platillo.idCategoria)
    };

    if (this.esEdicion && this.platilloId) {
      this.platillosService.updatePlatillo(this.platilloId, body).subscribe({
        next: () => {
          // Si el usuario seleccionó una imagen nueva en edición, subirla
          if (this.imagenFile) {
            this.subirImagen(this.platilloId!);
          } else {
            this.router.navigate(['/menu']);
          }
        },
        error: (err) => console.error('Error actualizando:', err)
      });
    } else {
      this.platillosService.createPlatillo(body).subscribe({
        next: (res) => {
          // El backend devuelve { idPlatillo: number }
          // Si hay imagen seleccionada, subirla antes de navegar
          if (this.imagenFile && res.idPlatillo) {
            this.subirImagen(res.idPlatillo);
          } else {
            this.router.navigate(['/menu']);
          }
        },
        error: (err) => console.error('Error creando:', err)
      });
    }
  }

  private subirImagen(idPlatillo: number) {
    this.platillosService.uploadImagen(idPlatillo, this.imagenFile!).subscribe({
      next: () => this.router.navigate(['/menu']),
      error: (err) => {
        // La imagen no es crítica: el platillo ya fue guardado, solo logueamos el error
        console.error('Error subiendo imagen:', err);
        this.router.navigate(['/menu']);
      }
    });
  }

  cancelar() {
    this.router.navigate(['/menu']);
  }
}