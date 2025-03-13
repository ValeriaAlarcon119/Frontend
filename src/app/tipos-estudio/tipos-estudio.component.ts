import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { environment } from '../../environments/environment';
import { TipoEstudio } from '../models/tipo-estudio.model';
import { Modal } from 'bootstrap';

@Component({
  selector: 'app-tipos-estudio',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './tipos-estudio.component.html',

})
export class TiposEstudioComponent implements OnInit {
  tiposEstudio: TipoEstudio[] = [];
  selectedTipoEstudio: TipoEstudio = { id: 0, nombre: '', descripcion: '', precio: 0 };
  isEditMode = false;
  isFormVisible = false;

  constructor(private http: HttpClient, private router: Router) {}

  ngOnInit(): void {
    this.loadTiposEstudio();
  }

  loadTiposEstudio(): void {
    this.http.get<TipoEstudio[]>(`${environment.api_url}/tipos-estudio`).subscribe({
      next: (data) => {
        this.tiposEstudio = data;
      },
      error: (error) => {
        console.error('Error al cargar tipos de estudio', error);
      }
    });
  }

  openCreateForm(): void {
    this.isEditMode = false;
    this.selectedTipoEstudio = { id: 0, nombre: '', descripcion: '', precio: 0 };
    this.showModal();
  }

  closeForm(): void {
    this.selectedTipoEstudio = { id: 0, nombre: '', descripcion: '', precio: 0 };
    this.isFormVisible = false;
    this.hideModal();
  }
  goBack() {
    this.router.navigate(['/dashboard']);
  }

  logout() {
    this.router.navigate(['/login']);
  }
  showModal(): void {
    const modalElement = document.getElementById('tipoEstudioModal');
    if (modalElement) {
      const modal = new Modal(modalElement);
      modal.show();
    }
  }

  hideModal(): void {
    const modalElement = document.getElementById('tipoEstudioModal');
    if (modalElement) {
      const modal = Modal.getInstance(modalElement);
      modal?.hide();
    }
  }

  openEditForm(tipoEstudio: TipoEstudio): void {
    this.isEditMode = true;
    this.selectedTipoEstudio = { ...tipoEstudio };
    this.showModal();
  }

  createTipoEstudio(): void {
    if (this.selectedTipoEstudio) {
      this.http.post<TipoEstudio>(`${environment.api_url}/tipos-estudio`, this.selectedTipoEstudio).subscribe({
        next: (response) => {
          this.loadTiposEstudio();
          this.closeForm();
        },
        error: (error) => {
          console.error('Error al crear tipo de estudio', error);
        }
      });
    }
  }

  saveEdit(): void {
    if (this.selectedTipoEstudio) {
      this.http.put<TipoEstudio>(`${environment.api_url}/tipos-estudio/${this.selectedTipoEstudio.id}`, this.selectedTipoEstudio).subscribe({
        next: (response) => {
          this.loadTiposEstudio();
          this.closeForm();
        },
        error: (error) => {
          console.error('Error al actualizar tipo de estudio', error);
        }
      });
    }
  }

  deleteTipoEstudio(id: number): void {
    if (confirm('¿Seguro que deseas eliminar este tipo de estudio?')) {
      this.http.delete(`${environment.api_url}/tipos-estudio/${id}`).subscribe({
        next: () => {
          this.loadTiposEstudio();
        },
        error: (error) => {
          console.error('Error al eliminar tipo de estudio', error);
        }
      });
    }
  }

  viewDetails(tipoEstudio: TipoEstudio): void {
    this.selectedTipoEstudio = { ...tipoEstudio };
    this.showDetailsModal();
  }

  showDetailsModal(): void {
    const modalElement = document.getElementById('tipoEstudioDetailsModal');
    if (modalElement) {
      const modal = new Modal(modalElement);
      modal.show();
    }
  }

  closeDetailsModal(): void {
    const modalElement = document.getElementById('tipoEstudioDetailsModal');
    if (modalElement) {
      const modal = Modal.getInstance(modalElement);
      modal?.hide();
    }
  }
}
