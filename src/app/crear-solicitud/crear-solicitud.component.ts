import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-crear-solicitud',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="container mt-5">
      <h2 class="text-center mb-4">Crear Nueva Solicitud</h2>
      <div class="card" style="border-radius: 15px;">
        <div class="card-body">
          <form (ngSubmit)="createSolicitud()">
            <div class="mb-3">
              <label for="candidato">Seleccionar Candidato:</label>
              <select id="candidato" [(ngModel)]="selectedCandidato" name="candidato" required class="form-select">
                <option value="">Seleccione un candidato</option>
                <option *ngFor="let candidato of candidatos" [value]="candidato.id">{{ candidato.nombre }} {{ candidato.apellido }}</option>
              </select>
            </div>
            <div class="mb-3">
              <label for="tipoEstudio">Seleccionar Tipo de Estudio:</label>
              <select id="tipoEstudio" [(ngModel)]="selectedTipoEstudio" name="tipoEstudio" required class="form-select">
                <option value="">Seleccione un tipo de estudio</option>
                <option *ngFor="let tipo of tipoEstudios" [value]="tipo.id">{{ tipo.nombre }}</option>
              </select>
            </div>
            <div class="mb-3">
              <label for="estado">Seleccionar Estado:</label>
              <select id="estado" [(ngModel)]="selectedEstado" name="estado" required class="form-select">
                <option value="">Seleccione un estado</option>
                <option value="pendiente">Pendiente</option>
                <option value="en_proceso">En Proceso</option>
                <option value="completado">Completado</option>
              </select>
            </div>
            <div class="text-center">
              <button type="submit" class="btn btn-primary">Crear Solicitud</button>
            </div>
          </form>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .container {
      display: flex;
      justify-content: center;
      align-items: center;
      height: 100vh; /* Centra verticalmente */
    }
    .card {
      width: 100%;
      max-width: 500px; /* Ancho máximo del formulario */
      margin: 0 auto; /* Centra horizontalmente */
      padding: 20px; /* Espaciado interno */
    }
    .form-select {
      display: block;
      margin: 0 auto; /* Centra los select */
      width: 100%; /* Asegura que ocupen todo el ancho */
    }
  `]
})
export class CrearSolicitudComponent implements OnInit {
  candidatos: any[] = [];
  tipoEstudios: any[] = [];
  selectedCandidato: number | null = null;
  selectedTipoEstudio: number | null = null;
  selectedEstado: string = '';

  constructor(private http: HttpClient, private router: Router) {}

  ngOnInit(): void {
    this.loadCandidatos();
    this.loadTipoEstudios();
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

  createSolicitud(): void {
    const nuevaSolicitud = {
      candidato_id: this.selectedCandidato,
      tipo_estudio_id: this.selectedTipoEstudio,
      estado: this.selectedEstado
    };

    this.http.post('http://localhost:8000/api/solicitudes', nuevaSolicitud).subscribe({
      next: (response) => {
        console.log('Solicitud creada con éxito', response);
        this.router.navigate(['/solicitudes']);
      },
      error: (error) => {
        console.error('Error al crear solicitud', error);
      }
    });
  }
}
