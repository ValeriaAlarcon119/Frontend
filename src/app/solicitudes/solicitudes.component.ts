import { Component, OnInit, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatDialogModule, MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSnackBarModule, MatSnackBar } from '@angular/material/snack-bar';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { SolicitudService } from '../services/solicitud.service';
import { CandidatoService } from '../services/candidato.service';
import { TipoEstudioService } from '../services/tipo-estudio.service';

@Component({
  selector: 'app-solicitudes',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MatCardModule,
    MatTableModule,
    MatButtonModule,
    MatIconModule,
    MatMenuModule,
    MatDialogModule,
    MatSnackBarModule,
    MatProgressSpinnerModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    ReactiveFormsModule
  ],
  template: `
    <div class="solicitudes-container">
      <div class="header">
        <h1>Solicitudes</h1>
        <button mat-raised-button color="primary" (click)="abrirDialogoNuevaSolicitud()" class="new-button">
          <mat-icon>add</mat-icon>
          Nueva Solicitud
        </button>
      </div>

      <mat-card class="table-card">
        <mat-card-content>
          <div class="table-container">
            <table mat-table [dataSource]="solicitudes" class="mat-elevation-z0">
              <!-- ID Column -->
              <ng-container matColumnDef="id">
                <th mat-header-cell *matHeaderCellDef>ID</th>
                <td mat-cell *matCellDef="let solicitud">{{solicitud.id}}</td>
              </ng-container>

              <!-- Candidato Column -->
              <ng-container matColumnDef="candidato">
                <th mat-header-cell *matHeaderCellDef>Candidato</th>
                <td mat-cell *matCellDef="let solicitud">
                  <div class="candidato-cell">
                    <mat-icon class="cell-icon">person</mat-icon>
                    {{solicitud.candidato?.nombre || 'Sin candidato'}}
                  </div>
                </td>
              </ng-container>

              <!-- Tipo de Estudio Column -->
              <ng-container matColumnDef="tipo_estudio">
                <th mat-header-cell *matHeaderCellDef>Tipo de Estudio</th>
                <td mat-cell *matCellDef="let solicitud">
                  <div class="tipo-cell">
                    <mat-icon class="cell-icon">school</mat-icon>
                    {{solicitud.tipo_estudio?.nombre || 'Sin tipo'}}
                  </div>
                </td>
              </ng-container>

              <!-- Estado Column -->
              <ng-container matColumnDef="estado">
                <th mat-header-cell *matHeaderCellDef>Estado</th>
                <td mat-cell *matCellDef="let solicitud">
                  <span class="estado-badge" [ngClass]="solicitud.estado">
                    <mat-icon class="estado-icon">{{getEstadoIcon(solicitud.estado)}}</mat-icon>
                    {{formatEstado(solicitud.estado)}}
                  </span>
                </td>
              </ng-container>

              <!-- Fecha Column -->
              <ng-container matColumnDef="fecha">
                <th mat-header-cell *matHeaderCellDef>Fecha</th>
                <td mat-cell *matCellDef="let solicitud">
                  <div class="fecha-cell">
                    <mat-icon class="cell-icon">event</mat-icon>
                    {{solicitud.created_at | date:'medium'}}
                  </div>
                </td>
              </ng-container>

              <!-- Actions Column -->
              <ng-container matColumnDef="actions">
                <th mat-header-cell *matHeaderCellDef>Acciones</th>
                <td mat-cell *matCellDef="let solicitud">
                  <div class="actions-cell">
                    <button mat-icon-button color="primary" (click)="editarSolicitud(solicitud)" matTooltip="Editar">
                      <mat-icon>edit</mat-icon>
                    </button>
                    <button mat-icon-button color="warn" (click)="eliminarSolicitud(solicitud)" matTooltip="Eliminar">
                      <mat-icon>delete</mat-icon>
                    </button>
                  </div>
                </td>
              </ng-container>

              <tr mat-header-row *matHeaderRowDef="displayedColumns" class="mat-header-row"></tr>
              <tr mat-row *matRowDef="let row; columns: displayedColumns;" class="mat-row"></tr>
            </table>

            <div class="loading-shade" *ngIf="loading">
              <mat-spinner></mat-spinner>
            </div>

            <div class="no-data" *ngIf="!loading && solicitudes.length === 0">
              <mat-icon>inbox</mat-icon>
              <p>No hay solicitudes registradas</p>
              <button mat-raised-button color="primary" (click)="abrirDialogoNuevaSolicitud()">
                <mat-icon>add</mat-icon>
                Crear Primera Solicitud
              </button>
            </div>
          </div>
        </mat-card-content>
      </mat-card>
    </div>
  `,
  styles: [`
    :host {
      --primary-color: #2c3e50;
      --secondary-color: #34495e;
      --accent-color: #3498db;
      --success-color: #2ecc71;
      --warning-color: #f1c40f;
      --danger-color: #e74c3c;
      --text-primary: #2c3e50;
      --text-secondary: #7f8c8d;
      --border-color: #ecf0f1;
      --hover-color: #f8f9fa;
      --shadow-color: rgba(0, 0, 0, 0.1);
    }

    .solicitudes-container {
      padding: 24px;
      background-color: #f5f6fa;
      min-height: 100vh;
    }

    .header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 24px;
    }

    .header h1 {
      margin: 0;
      color: var(--primary-color);
      font-size: 2rem;
      font-weight: 600;
    }

    .new-button {
      background: linear-gradient(135deg, var(--accent-color), #2980b9);
      color: white;
      padding: 8px 24px;
      border-radius: 8px;
      transition: all 0.3s ease;
    }

    .new-button:hover {
      transform: translateY(-2px);
      box-shadow: 0 4px 12px var(--shadow-color);
    }

    .table-card {
      border-radius: 12px;
      box-shadow: 0 4px 6px var(--shadow-color) !important;
      overflow: hidden;
    }

    .table-container {
      position: relative;
      min-height: 200px;
      overflow: auto;
    }

    table {
      width: 100%;
    }

    .mat-header-row {
      background-color: #f8f9fa;
      border-bottom: 2px solid var(--border-color);
    }

    .mat-header-cell {
      color: var(--text-primary);
      font-weight: 600;
      font-size: 14px;
      padding: 16px;
    }

    .mat-row {
      transition: background-color 0.3s ease;
    }

    .mat-row:hover {
      background-color: var(--hover-color);
    }

    .mat-cell {
      padding: 16px;
      color: var(--text-secondary);
      font-size: 14px;
    }

    .candidato-cell, .tipo-cell, .fecha-cell {
      display: flex;
      align-items: center;
      gap: 8px;
    }

    .cell-icon {
      font-size: 18px;
      width: 18px;
      height: 18px;
      color: var(--accent-color);
    }

    .estado-badge {
      display: inline-flex;
      align-items: center;
      gap: 4px;
      padding: 6px 12px;
      border-radius: 20px;
      font-size: 0.875rem;
      font-weight: 500;
      text-transform: capitalize;
    }

    .estado-icon {
      font-size: 16px;
      width: 16px;
      height: 16px;
    }

    .estado-badge.pendiente {
      background-color: #FFF3E0;
      color: #E65100;
    }

    .estado-badge.en_proceso {
      background-color: #E3F2FD;
      color: #1565C0;
    }

    .estado-badge.completado {
      background-color: #E8F5E9;
      color: #2E7D32;
    }

    .estado-badge.cancelado {
      background-color: #FFEBEE;
      color: #C62828;
    }

    .estado-badge.rechazado {
      background-color: #FCE4EC;
      color: #C2185B;
    }

    .actions-cell {
      display: flex;
      gap: 8px;
      justify-content: flex-start;
    }

    .loading-shade {
      position: absolute;
      top: 0;
      left: 0;
      bottom: 0;
      right: 0;
      background: rgba(255, 255, 255, 0.8);
      z-index: 1;
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .no-data {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      padding: 48px;
      color: var(--text-secondary);
      text-align: center;
    }

    .no-data mat-icon {
      font-size: 64px;
      width: 64px;
      height: 64px;
      margin-bottom: 16px;
      color: var(--accent-color);
      opacity: 0.5;
    }

    .no-data p {
      margin: 0 0 24px 0;
      font-size: 1.1rem;
    }

    @media (max-width: 600px) {
      .solicitudes-container {
        padding: 16px;
      }

      .header {
        flex-direction: column;
        gap: 16px;
        align-items: stretch;
      }

      .header button {
        width: 100%;
      }

      .mat-mdc-table {
        display: block;
        overflow-x: auto;
      }

      .mat-cell {
        padding: 12px;
      }

      .estado-badge {
        padding: 4px 8px;
      }
    }
  `]
})
export class SolicitudesComponent implements OnInit {
  solicitudes: any[] = [];
  candidatos: any[] = [];
  tiposEstudio: any[] = [];
  displayedColumns: string[] = ['id', 'candidato', 'tipo_estudio', 'estado', 'fecha', 'actions'];
  loading = false;
  solicitudForm: FormGroup;

  constructor(
    private solicitudService: SolicitudService,
    private candidatoService: CandidatoService,
    private tipoEstudioService: TipoEstudioService,
    private dialog: MatDialog,
    private snackBar: MatSnackBar,
    private fb: FormBuilder
  ) {
    this.solicitudForm = this.fb.group({
      candidato_id: ['', Validators.required],
      tipo_estudio_id: ['', Validators.required],
      estado: ['pendiente', Validators.required]
    });
  }

  ngOnInit(): void {
    this.cargarDatos();
  }

  private cargarDatos(): void {
    this.loading = true;
    Promise.all([
      this.cargarSolicitudes(),
      this.cargarCandidatos(),
      this.cargarTiposEstudio()
    ]).finally(() => {
      this.loading = false;
    });
  }

  private cargarSolicitudes(): Promise<void> {
    return new Promise((resolve) => {
      this.solicitudService.getSolicitudes().subscribe({
        next: (solicitudes) => {
          this.solicitudes = solicitudes;
          resolve();
        },
        error: (error) => {
          this.showError('Error al cargar las solicitudes');
          resolve();
        }
      });
    });
  }

  private cargarCandidatos(): Promise<void> {
    return new Promise((resolve) => {
      this.candidatoService.getCandidatos().subscribe({
        next: (candidatos) => {
          this.candidatos = candidatos;
          resolve();
        },
        error: (error) => {
          this.showError('Error al cargar los candidatos');
          resolve();
        }
      });
    });
  }

  private cargarTiposEstudio(): Promise<void> {
    return new Promise((resolve) => {
      this.tipoEstudioService.getTiposEstudio().subscribe({
        next: (tipos) => {
          this.tiposEstudio = tipos;
          resolve();
        },
        error: (error) => {
          this.showError('Error al cargar los tipos de estudio');
          resolve();
        }
      });
    });
  }

  abrirDialogoNuevaSolicitud(): void {
    const dialogRef = this.dialog.open(NuevaSolicitudDialogComponent, {
      width: '500px',
      data: {
        candidatos: this.candidatos,
        tiposEstudio: this.tiposEstudio
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.cargarSolicitudes();
      }
    });
  }

  editarSolicitud(solicitud: any): void {
    const dialogRef = this.dialog.open(EditarSolicitudDialogComponent, {
      width: '500px',
      data: {
        solicitud,
        candidatos: this.candidatos,
        tiposEstudio: this.tiposEstudio
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.cargarSolicitudes();
      }
    });
  }

  eliminarSolicitud(solicitud: any): void {
    if (confirm('¿Está seguro de eliminar esta solicitud?')) {
      this.solicitudService.deleteSolicitud(solicitud.id).subscribe({
        next: () => {
          this.showSuccess('Solicitud eliminada correctamente');
          this.cargarSolicitudes();
        },
        error: (error) => {
          this.showError('Error al eliminar la solicitud');
        }
      });
    }
  }

  getEstadoIcon(estado: string): string {
    const iconos: Record<string, string> = {
      'pendiente': 'schedule',
      'en_proceso': 'pending_actions',
      'completado': 'check_circle',
      'cancelado': 'cancel',
      'rechazado': 'block'
    };
    return iconos[estado] || 'help';
  }

  formatEstado(estado: string): string {
    const estados: Record<string, string> = {
      'pendiente': 'Pendiente',
      'en_proceso': 'En Proceso',
      'completado': 'Completado',
      'cancelado': 'Cancelado',
      'rechazado': 'Rechazado'
    };
    return estados[estado] || estado;
  }

  private showError(message: string): void {
    this.snackBar.open(message, 'Cerrar', {
      duration: 5000,
      horizontalPosition: 'center',
      verticalPosition: 'top',
      panelClass: ['error-snackbar']
    });
  }

  private showSuccess(message: string): void {
    this.snackBar.open(message, 'Cerrar', {
      duration: 3000,
      horizontalPosition: 'center',
      verticalPosition: 'top',
      panelClass: ['success-snackbar']
    });
  }
}

@Component({
  selector: 'app-nueva-solicitud-dialog',
  standalone: true,
  imports: [
    CommonModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
    ReactiveFormsModule
  ],
  template: `
    <h2 mat-dialog-title>Nueva Solicitud</h2>
    <form [formGroup]="form" (ngSubmit)="onSubmit()">
      <mat-dialog-content>
        <mat-form-field appearance="outline" class="full-width">
          <mat-label>Candidato</mat-label>
          <mat-select formControlName="candidato_id">
            <mat-option *ngFor="let candidato of data.candidatos" [value]="candidato.id">
              {{candidato.nombre}}
            </mat-option>
          </mat-select>
          <mat-error *ngIf="form.get('candidato_id')?.hasError('required')">
            El candidato es requerido
          </mat-error>
        </mat-form-field>

        <mat-form-field appearance="outline" class="full-width">
          <mat-label>Tipo de Estudio</mat-label>
          <mat-select formControlName="tipo_estudio_id">
            <mat-option *ngFor="let tipo of data.tiposEstudio" [value]="tipo.id">
              {{tipo.nombre}}
            </mat-option>
          </mat-select>
          <mat-error *ngIf="form.get('tipo_estudio_id')?.hasError('required')">
            El tipo de estudio es requerido
          </mat-error>
        </mat-form-field>

        <mat-form-field appearance="outline" class="full-width">
          <mat-label>Estado</mat-label>
          <mat-select formControlName="estado">
            <mat-option value="pendiente">Pendiente</mat-option>
            <mat-option value="en_proceso">En Proceso</mat-option>
            <mat-option value="completado">Completado</mat-option>
            <mat-option value="cancelado">Cancelado</mat-option>
            <mat-option value="rechazado">Rechazado</mat-option>
          </mat-select>
        </mat-form-field>
      </mat-dialog-content>

      <mat-dialog-actions align="end">
        <button mat-button type="button" (click)="onCancel()">Cancelar</button>
        <button mat-raised-button color="primary" type="submit" [disabled]="form.invalid">
          Crear Solicitud
        </button>
      </mat-dialog-actions>
    </form>
  `,
  styles: [`
    mat-dialog-content {
      padding: 20px;
    }

    .full-width {
      width: 100%;
      margin-bottom: 16px;
    }

    mat-form-field {
      margin-bottom: 16px;
    }

    mat-dialog-actions {
      padding: 16px;
      gap: 8px;
    }
  `]
})
export class NuevaSolicitudDialogComponent {
  form: FormGroup;

  constructor(
    public dialogRef: MatDialogRef<NuevaSolicitudDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private fb: FormBuilder,
    private solicitudService: SolicitudService,
    private snackBar: MatSnackBar
  ) {
    this.form = this.fb.group({
      candidato_id: ['', Validators.required],
      tipo_estudio_id: ['', Validators.required],
      estado: ['pendiente', Validators.required]
    });
  }

  onSubmit(): void {
    if (this.form.valid) {
      this.solicitudService.createSolicitud(this.form.value).subscribe({
        next: () => {
          this.snackBar.open('Solicitud creada correctamente', 'Cerrar', {
            duration: 3000
          });
          this.dialogRef.close(true);
        },
        error: (error) => {
          this.snackBar.open('Error al crear la solicitud', 'Cerrar', {
            duration: 5000
          });
        }
      });
    }
  }

  onCancel(): void {
    this.dialogRef.close();
  }
}

@Component({
  selector: 'app-editar-solicitud-dialog',
  standalone: true,
  imports: [
    CommonModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
    ReactiveFormsModule
  ],
  template: `
    <h2 mat-dialog-title>Editar Solicitud</h2>
    <form [formGroup]="form" (ngSubmit)="onSubmit()">
      <mat-dialog-content>
        <mat-form-field appearance="outline" class="full-width">
          <mat-label>Candidato</mat-label>
          <mat-select formControlName="candidato_id">
            <mat-option *ngFor="let candidato of data.candidatos" [value]="candidato.id">
              {{candidato.nombre}}
            </mat-option>
          </mat-select>
          <mat-error *ngIf="form.get('candidato_id')?.hasError('required')">
            El candidato es requerido
          </mat-error>
        </mat-form-field>

        <mat-form-field appearance="outline" class="full-width">
          <mat-label>Tipo de Estudio</mat-label>
          <mat-select formControlName="tipo_estudio_id">
            <mat-option *ngFor="let tipo of data.tiposEstudio" [value]="tipo.id">
              {{tipo.nombre}}
            </mat-option>
          </mat-select>
          <mat-error *ngIf="form.get('tipo_estudio_id')?.hasError('required')">
            El tipo de estudio es requerido
          </mat-error>
        </mat-form-field>

        <mat-form-field appearance="outline" class="full-width">
          <mat-label>Estado</mat-label>
          <mat-select formControlName="estado">
            <mat-option value="pendiente">Pendiente</mat-option>
            <mat-option value="en_proceso">En Proceso</mat-option>
            <mat-option value="completado">Completado</mat-option>
            <mat-option value="cancelado">Cancelado</mat-option>
            <mat-option value="rechazado">Rechazado</mat-option>
          </mat-select>
        </mat-form-field>
      </mat-dialog-content>

      <mat-dialog-actions align="end">
        <button mat-button type="button" (click)="onCancel()">Cancelar</button>
        <button mat-raised-button color="primary" type="submit" [disabled]="form.invalid">
          Guardar Cambios
        </button>
      </mat-dialog-actions>
    </form>
  `,
  styles: [`
    mat-dialog-content {
      padding: 20px;
    }

    .full-width {
      width: 100%;
      margin-bottom: 16px;
    }

    mat-form-field {
      margin-bottom: 16px;
    }

    mat-dialog-actions {
      padding: 16px;
      gap: 8px;
    }
  `]
})
export class EditarSolicitudDialogComponent {
  form: FormGroup;

  constructor(
    public dialogRef: MatDialogRef<EditarSolicitudDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private fb: FormBuilder,
    private solicitudService: SolicitudService,
    private snackBar: MatSnackBar
  ) {
    this.form = this.fb.group({
      candidato_id: [data.solicitud.candidato_id, Validators.required],
      tipo_estudio_id: [data.solicitud.tipo_estudio_id, Validators.required],
      estado: [data.solicitud.estado, Validators.required]
    });
  }

  onSubmit(): void {
    if (this.form.valid) {
      this.solicitudService.updateSolicitud(this.data.solicitud.id, this.form.value).subscribe({
        next: () => {
          this.snackBar.open('Solicitud actualizada correctamente', 'Cerrar', {
            duration: 3000
          });
          this.dialogRef.close(true);
        },
        error: (error) => {
          this.snackBar.open('Error al actualizar la solicitud', 'Cerrar', {
            duration: 5000
          });
        }
      });
    }
  }

  onCancel(): void {
    this.dialogRef.close();
  }
}
