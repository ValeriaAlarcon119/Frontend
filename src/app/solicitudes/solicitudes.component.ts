import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

import { Modal } from 'bootstrap';

@Component({
  selector: 'app-solicitudes',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="container mt-5">
      <div class="d-flex justify-content-between align-items-center mb-3">
        <span class="text-primary" style="cursor: pointer; text-decoration: underline;" (click)="goBack()">Atrás</span>
        <span class="text-danger" style="cursor: pointer; text-decoration: underline;" (click)="logout()">Salir</span>
      </div>
      <h2 class="text-center">Listado de Solicitudes</h2>
      
      <div class="text-center mb-3">
        <label>
          <input type="checkbox" [(ngModel)]="isFilterActive" (change)="toggleFilters()" />
          Filtro
        </label>
        <i class="fas fa-plus-circle text-success ms-3" (click)="openCreateForm()" style="cursor: pointer; font-size: 1.2rem;" title="Agregar Solicitud"></i>
        <span class="text-success ms-2" (click)="openCreateForm()" style="cursor: pointer; text-decoration: underline; font-size: 0.9rem;" title="Nueva Solicitud">Nueva Solicitud</span>
      </div>

      <div *ngIf="isFilterActive" class="d-flex justify-content-center align-items-center mb-3" style="gap: 10px;">
        <div class="me-2" style="flex: 1; max-width: 150px;">
          <label for="estado" class="form-label" style="font-size: 0.9rem;">Estado:</label>
          <select id="estado" [(ngModel)]="selectedEstado" (change)="loadSolicitudes()" class="form-select form-select-sm">
            <option value="">Todos</option>
            <option *ngFor="let estado of estados" [value]="estado">{{ estado | titlecase }}</option>
          </select>
        </div>
        <div style="flex: 1; max-width: 150px;">
          <label for="tipoEstudio" class="form-label" style="font-size: 0.9rem;">Tipo de Estudio:</label>
          <select id="tipoEstudio" [(ngModel)]="selectedTipoEstudio" (change)="loadSolicitudes()" class="form-select form-select-sm">
            <option value="">Todos</option>
            <option *ngFor="let tipo of tipoEstudios" [value]="tipo.id">{{ tipo.nombre }}</option>
          </select>
        </div>
      </div>

      <table class="table table-striped text-center" style="max-width: 600px; margin: 0 auto;">
        <thead class="table-dark">
          <tr>
            <th>Estado</th>
            <th>Tipo de Estudio</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          <tr *ngFor="let solicitud of solicitudes">
            <td>{{ getEstadoNombre(solicitud.estado) }}</td>
            <td>{{ getTipoEstudioNombre(solicitud.tipo_estudio_id) }}</td>
            <td>
              <i class="fas fa-edit text-primary me-2" (click)="openEditForm(solicitud)" style="cursor: pointer;"></i>
              <i class="fas fa-trash-alt text-danger" (click)="deleteSolicitud(solicitud.id)" style="cursor: pointer;"></i>
              <i class="fas fa-eye text-info ms-2" (click)="viewDetails(solicitud)" style="cursor: pointer;" title="Ver Detalles"></i>
            </td>
          </tr>
        </tbody>
      </table>

      <!-- Modal para Editar o Crear Solicitud -->
      <div class="modal fade" id="editModal" tabindex="-1" aria-labelledby="editModalLabel" aria-hidden="true" [ngClass]="{'show': isEditMode || isCreateMode}" style="display: (isEditMode || isCreateMode ? 'block' : 'none');">
        <div class="modal-dialog">
          <div class="modal-content">
            <div class="modal-header">
              <h5 class="modal-title" id="editModalLabel">{{ isEditMode ? 'Editar Solicitud' : 'Crear Nueva Solicitud' }}</h5>
              <button type="button" class="btn-close" (click)="closeForm()" aria-label="Close"></button>
            </div>
            <div class="modal-body">
              <form (ngSubmit)="isEditMode ? saveEdit() : createSolicitud()" #solicitudForm="ngForm">
                <div class="mb-3">
                  <label for="candidato">Seleccionar Candidato:</label>
                  <select id="candidato" [(ngModel)]="selectedCandidato" name="candidato" required class="form-select">
                    <option value=""></option>
                    <option *ngFor="let candidato of candidatos" [value]="candidato.id">{{ candidato.nombre }} {{ candidato.apellido }}</option>
                  </select>
                  <div *ngIf="!selectedCandidato && formSubmitted" class="text-danger">El candidato es requerido.</div>
                </div>
                <div class="mb-3">
                  <label for="tipoEstudio">Seleccionar Tipo de Estudio:</label>
                  <select id="tipoEstudio" [(ngModel)]="selectedTipoEstudio" name="tipoEstudio" required class="form-select">
                    <option value=""></option>
                    <option *ngFor="let tipo of tipoEstudios" [value]="tipo.id">{{ tipo.nombre }}</option>
                  </select>
                  <div *ngIf="!selectedTipoEstudio && formSubmitted" class="text-danger">El tipo de estudio es requerido.</div>
                </div>
                <div class="mb-3">
                  <label for="estado">Seleccionar Estado:</label>
                  <select id="estado" [(ngModel)]="selectedEstado" name="estado" required class="form-select">
                    <option value=""></option>
                    <option value="pendiente">Pendiente</option>
                    <option value="en_proceso">En Proceso</option>
                    <option value="completado">Completado</option>
                  </select>
                  <div *ngIf="!selectedEstado && formSubmitted" class="text-danger">El estado es requerido.</div>
                </div>
                <div class="mb-3">
                  <label for="fechaSolicitud">Fecha de Solicitud:</label>
                  <input type="date" id="fechaSolicitud" [(ngModel)]="selectedSolicitud.fecha_solicitud" name="fechaSolicitud" class="form-control">
                </div>
                <div class="mb-3">
                  <label for="fechaCompletado">Fecha de Completado:</label>
                  <input type="date" id="fechaCompletado" [(ngModel)]="selectedSolicitud.fecha_completado" name="fechaCompletado" class="form-control">
                </div>
                <div class="text-center">
                  <button type="submit" class="btn btn-success">{{ isEditMode ? 'Guardar Cambios' : 'Crear Solicitud' }}</button>
                  <button type="button" class="btn btn-secondary" (click)="closeForm()">Cancelar</button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>

      <!-- Modal para Mostrar Detalles de la Solicitud -->
      <div class="modal fade" id="solicitudDetailsModal" tabindex="-1" aria-labelledby="solicitudDetailsModalLabel" aria-hidden="true">
        <div class="modal-dialog">
          <div class="modal-content">
            <div class="modal-header">
              <h5 class="modal-title" id="solicitudDetailsModalLabel">Detalles de la Solicitud</h5>
              <button type="button" class="btn-close" (click)="closeDetailsModal()" aria-label="Close"></button>
            </div>
            <div class="modal-body">
              <p><strong>Candidato:</strong> {{ getCandidatoNombre(selectedSolicitud.candidato_id) }}</p>
              <p><strong>Tipo de Estudio:</strong> {{ getTipoEstudioNombre(selectedSolicitud.tipo_estudio_id) }}</p>
              <p><strong>Estado:</strong> {{ getEstadoNombre(selectedSolicitud.estado) }}</p>
              <p><strong>Fecha de Solicitud:</strong> {{ selectedSolicitud.fecha_solicitud | date:'shortDate' }}</p>
              <p><strong>Fecha de Completado:</strong> {{ selectedSolicitud.fecha_completado | date:'shortDate' }}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .container {
      margin-top: 20px;
    }
    .modal.show {
      display: block;
      background: rgba(0, 0, 0, 0.5);
    }
  `]
})
export class SolicitudesComponent implements OnInit {
  solicitudes: any[] = [];
  candidatos: any[] = [];
  tipoEstudios: any[] = [];
  estados: string[] = ['pendiente', 'en_proceso', 'completado'];
  selectedEstado: string = '';
  selectedTipoEstudio: string = '';
  selectedCandidato: number | null = null;
  isEditMode: boolean = false; 
  isCreateMode: boolean = false; 
  selectedSolicitud: any = {
    candidato_id: null,
    tipo_estudio_id: null,
    estado: '',
    fecha_solicitud: null,
    fecha_completado: null
  }; 
  formSubmitted: boolean = false; 
  isFilterActive: boolean = false;

  constructor(private http: HttpClient, private router: Router) {}

  ngOnInit(): void {
    this.loadSolicitudes();
    this.loadCandidatos();
    this.loadTipoEstudios();
  }

  toggleFilters(): void {
    if (!this.isFilterActive) {
      this.selectedEstado = '';
      this.selectedTipoEstudio = '';
    }
    this.loadSolicitudes();
  }

  loadSolicitudes(): void {
    let params = new HttpParams();
    if (this.isFilterActive) {
      if (this.selectedEstado) params = params.set('estado', this.selectedEstado);
      if (this.selectedTipoEstudio) params = params.set('tipo_estudio_id', this.selectedTipoEstudio.toString());
    }

    this.http.get<any[]>('http://localhost:8000/api/solicitudes', { params }).subscribe({
      next: (data) => {
        this.solicitudes = data;
      },
      error: (error) => {
        console.error('Error al cargar solicitudes', error);
      }
    });
  }

  loadCandidatos(): void {
    this.http.get<any[]>('http://localhost:8000/api/candidatos').subscribe({
      next: (data) => {
        this.candidatos = data;
      },
      error: (error) => {
        console.error('Error al cargar candidatos', error);
      }
    });
  }

  loadTipoEstudios(): void {
    this.http.get<any[]>('http://localhost:8000/api/tipos-estudio').subscribe({
      next: (data) => {
        this.tipoEstudios = data;
      },
      error: (error) => {
        console.error('Error al cargar tipos de estudio', error);
      }
    });
  }

  openEditForm(solicitud: any): void {
    this.isEditMode = true;
    this.isCreateMode = false; 
    this.selectedSolicitud = solicitud; 
    this.selectedCandidato = solicitud.candidato_id; 
    this.selectedTipoEstudio = solicitud.tipo_estudio_id; 
    this.selectedEstado = solicitud.estado; 
  }

  openCreateForm(): void {
    this.isCreateMode = true; 
    this.isEditMode = false; 
    this.selectedCandidato = null;
    this.selectedTipoEstudio = ''; 
    this.selectedEstado = ''; 
  }

  saveEdit(): void { 
    const updatedSolicitud = {
      candidato_id: this.selectedCandidato,
      tipo_estudio_id: this.selectedTipoEstudio,
      estado: this.selectedEstado,
      fecha_solicitud: this.selectedSolicitud.fecha_solicitud,
      fecha_completado: this.selectedSolicitud.fecha_completado
    };

    this.http.put(`http://localhost:8000/api/solicitudes/${this.selectedSolicitud.id}`, updatedSolicitud).subscribe({
      next: (response) => {
        console.log('Solicitud actualizada con éxito', response);
        this.resetFilters();
        this.loadSolicitudes(); 
        this.closeForm(); 
      },
      error: (error) => {
        console.error('Error al actualizar solicitud', error);
      }
    });
  }

  createSolicitud(): void {
    this.formSubmitted = true; 
    const newSolicitud = {
      candidato_id: this.selectedCandidato,
      tipo_estudio_id: this.selectedTipoEstudio,
      estado: this.selectedEstado,
      fecha_solicitud: this.selectedSolicitud.fecha_solicitud,
      fecha_completado: this.selectedSolicitud.fecha_completado
    };

    this.http.post('http://localhost:8000/api/solicitudes', newSolicitud).subscribe({
      next: (response) => {
        console.log('Solicitud creada con éxito', response);
        this.resetFilters(); 
        this.loadSolicitudes(); 
        this.closeForm(); 
      },
      error: (error) => {
        console.error('Error al crear solicitud', error);
      }
    });
  }

  resetFilters(): void {
    this.selectedEstado = ''; 
    this.selectedTipoEstudio = ''; 
  }

  closeForm(): void {
    this.isEditMode = false;
    this.isCreateMode = false; 
    this.selectedCandidato = null;
    this.selectedTipoEstudio = ''; 
    this.selectedEstado = '';
    this.selectedSolicitud = {
      candidato_id: null,
      tipo_estudio_id: null,
      estado: '',
      fecha_solicitud: null,
      fecha_completado: null
    }; 
    this.formSubmitted = false; 
  }

  deleteSolicitud(id: number): void {
    if (confirm('¿Seguro que deseas eliminar esta solicitud?')) {
      this.http.delete(`http://localhost:8000/api/solicitudes/${id}`).subscribe({
        next: () => {
          this.loadSolicitudes();
        },
        error: (error) => {
          console.error('Error al eliminar solicitud', error);
        }
      });
    }
  }

  getEstadoNombre(estado: string): string {
    switch (estado) {
      case 'pendiente':
        return 'Pendiente';
      case 'en_proceso':
        return 'En Proceso';
      case 'completado':
        return 'Completado';
      default:
        return 'Desconocido';
    }
  }

  getTipoEstudioNombre(tipoEstudioId: number): string {
    const tipoEstudio = this.tipoEstudios.find(tipo => tipo.id === tipoEstudioId);
    return tipoEstudio ? tipoEstudio.nombre : 'Desconocido';
  }

  viewDetails(solicitud: any): void {
    this.selectedSolicitud = { ...solicitud };
    this.showDetailsModal();
  }

  showDetailsModal(): void {
    const modalElement = document.getElementById('solicitudDetailsModal');
    if (modalElement) {
      const modal = new Modal(modalElement);
      modal.show();
    }
  }

  closeDetailsModal(): void {
    const modalElement = document.getElementById('solicitudDetailsModal');
    if (modalElement) {
      const modal = Modal.getInstance(modalElement);
      modal?.hide();
    }
  }

  getCandidatoNombre(candidatoId: number): string {
    const candidato = this.candidatos.find(c => c.id === candidatoId);
    return candidato ? `${candidato.nombre} ${candidato.apellido}` : 'Desconocido';
  }

  goBack(): void {
    this.router.navigate(['/dashboard']);
  }

  logout(): void {
    this.router.navigate(['/login']);
  }
}
