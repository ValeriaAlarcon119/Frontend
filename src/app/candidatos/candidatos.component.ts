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
import { CandidatoService } from '../services/candidato.service';

@Component({
  selector: 'app-candidatos',
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
    <div class="candidatos-container">
      <div class="header">
        <h1>Candidatos</h1>
        <button mat-raised-button color="primary" (click)="abrirDialogoNuevoCandidato()" class="new-button">
          <mat-icon>person_add</mat-icon>
          Nuevo Candidato
        </button>
      </div>

      <mat-card class="table-card">
        <mat-card-content>
          <div class="table-container">
            <table mat-table [dataSource]="candidatos" class="mat-elevation-z0">
              <!-- ID Column -->
              <ng-container matColumnDef="id">
                <th mat-header-cell *matHeaderCellDef>ID</th>
                <td mat-cell *matCellDef="let candidato">{{candidato.id}}</td>
              </ng-container>

              <!-- Nombre Column -->
              <ng-container matColumnDef="nombre">
                <th mat-header-cell *matHeaderCellDef>Nombre</th>
                <td mat-cell *matCellDef="let candidato">
                  <div class="nombre-cell">
                    <mat-icon class="cell-icon">person</mat-icon>
                    {{candidato.nombre}} {{candidato.apellido}}
                  </div>
                </td>
              </ng-container>

              <!-- Documento Column -->
              <ng-container matColumnDef="documento">
                <th mat-header-cell *matHeaderCellDef>Documento</th>
                <td mat-cell *matCellDef="let candidato">
                  <div class="documento-cell">
                    <mat-icon class="cell-icon">badge</mat-icon>
                    {{candidato.documento_identidad}}
                  </div>
                </td>
              </ng-container>

              <!-- Email Column -->
              <ng-container matColumnDef="email">
                <th mat-header-cell *matHeaderCellDef>Email</th>
                <td mat-cell *matCellDef="let candidato">
                  <div class="email-cell">
                    <mat-icon class="cell-icon">email</mat-icon>
                    {{candidato.correo}}
                  </div>
                </td>
              </ng-container>

              <!-- Teléfono Column -->
              <ng-container matColumnDef="telefono">
                <th mat-header-cell *matHeaderCellDef>Teléfono</th>
                <td mat-cell *matCellDef="let candidato">
                  <div class="telefono-cell">
                    <mat-icon class="cell-icon">phone</mat-icon>
                    {{candidato.telefono || 'No especificado'}}
                  </div>
                </td>
              </ng-container>

              <!-- Actions Column -->
              <ng-container matColumnDef="actions">
                <th mat-header-cell *matHeaderCellDef>Acciones</th>
                <td mat-cell *matCellDef="let candidato">
                  <div class="actions-cell">
                    <button mat-icon-button color="primary" (click)="editarCandidato(candidato)" matTooltip="Editar">
                      <mat-icon>edit</mat-icon>
                    </button>
                    <button mat-icon-button color="warn" (click)="eliminarCandidato(candidato)" matTooltip="Eliminar">
                      <mat-icon>delete</mat-icon>
                    </button>
                    <button mat-icon-button color="accent" (click)="verDetalles(candidato)" matTooltip="Ver Detalles">
                      <mat-icon>visibility</mat-icon>
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

            <div class="no-data" *ngIf="!loading && candidatos.length === 0">
              <mat-icon>people</mat-icon>
              <p>No hay candidatos registrados</p>
              <button mat-raised-button color="primary" (click)="abrirDialogoNuevoCandidato()">
                <mat-icon>person_add</mat-icon>
                Crear Primer Candidato
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

    .candidatos-container {
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

    .nombre-cell, .documento-cell, .email-cell, .telefono-cell {
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
      .candidatos-container {
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
    }
  `]
})
export class CandidatosComponent implements OnInit {
  candidatos: any[] = [];
  displayedColumns: string[] = ['id', 'nombre', 'documento', 'email', 'telefono', 'actions'];
  loading = false;

  constructor(
    private candidatoService: CandidatoService,
    private dialog: MatDialog,
    private snackBar: MatSnackBar,
    private fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.cargarCandidatos();
  }

  private cargarCandidatos(): void {
    this.loading = true;
    this.candidatoService.getCandidatos().subscribe({
      next: (candidatos) => {
        this.candidatos = candidatos;
        this.loading = false;
      },
      error: (error) => {
        this.showError('Error al cargar los candidatos');
        this.loading = false;
      }
    });
  }

  abrirDialogoNuevoCandidato(): void {
    const dialogRef = this.dialog.open(NuevoCandidatoDialogComponent, {
      width: '500px'
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.cargarCandidatos();
      }
    });
  }

  editarCandidato(candidato: any): void {
    const dialogRef = this.dialog.open(EditarCandidatoDialogComponent, {
      width: '500px',
      data: { candidato }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.cargarCandidatos();
      }
    });
  }

  eliminarCandidato(candidato: any): void {
    if (confirm('¿Está seguro de eliminar este candidato?')) {
      this.candidatoService.deleteCandidato(candidato.id).subscribe({
        next: () => {
          this.showSuccess('Candidato eliminado correctamente');
          this.cargarCandidatos();
        },
        error: (error) => {
          this.showError('Error al eliminar el candidato');
        }
      });
    }
  }

  verDetalles(candidato: any): void {
    const dialogRef = this.dialog.open(DetallesCandidatoDialogComponent, {
      width: '500px',
      data: { candidato }
    });
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
  selector: 'app-nuevo-candidato-dialog',
  standalone: true,
  imports: [
    CommonModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    ReactiveFormsModule
  ],
  template: `
    <h2 mat-dialog-title>Nuevo Candidato</h2>
    <form [formGroup]="form" (ngSubmit)="onSubmit()">
      <mat-dialog-content>
        <mat-form-field appearance="outline" class="full-width">
          <mat-label>Nombre</mat-label>
          <input matInput formControlName="nombre" required>
          <mat-error *ngIf="form.get('nombre')?.hasError('required')">
            El nombre es requerido
          </mat-error>
        </mat-form-field>

        <mat-form-field appearance="outline" class="full-width">
          <mat-label>Apellido</mat-label>
          <input matInput formControlName="apellido" required>
          <mat-error *ngIf="form.get('apellido')?.hasError('required')">
            El apellido es requerido
          </mat-error>
        </mat-form-field>

        <mat-form-field appearance="outline" class="full-width">
          <mat-label>Documento de Identidad</mat-label>
          <input matInput formControlName="documento_identidad" required>
          <mat-error *ngIf="form.get('documento_identidad')?.hasError('required')">
            El documento es requerido
          </mat-error>
        </mat-form-field>

        <mat-form-field appearance="outline" class="full-width">
          <mat-label>Correo Electrónico</mat-label>
          <input matInput formControlName="correo" type="email" required>
          <mat-error *ngIf="form.get('correo')?.hasError('required')">
            El correo es requerido
          </mat-error>
          <mat-error *ngIf="form.get('correo')?.hasError('email')">
            Ingrese un correo válido
          </mat-error>
        </mat-form-field>

        <mat-form-field appearance="outline" class="full-width">
          <mat-label>Teléfono</mat-label>
          <input matInput formControlName="telefono">
        </mat-form-field>
      </mat-dialog-content>

      <mat-dialog-actions align="end">
        <button mat-button type="button" (click)="onCancel()">Cancelar</button>
        <button mat-raised-button color="primary" type="submit" [disabled]="form.invalid">
          Crear Candidato
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
export class NuevoCandidatoDialogComponent {
  form: FormGroup;

  constructor(
    public dialogRef: MatDialogRef<NuevoCandidatoDialogComponent>,
    private fb: FormBuilder,
    private candidatoService: CandidatoService,
    private snackBar: MatSnackBar
  ) {
    this.form = this.fb.group({
      nombre: ['', Validators.required],
      apellido: ['', Validators.required],
      documento_identidad: ['', Validators.required],
      correo: ['', [Validators.required, Validators.email]],
      telefono: ['']
    });
  }

  onSubmit(): void {
    if (this.form.valid) {
      this.candidatoService.createCandidato(this.form.value).subscribe({
        next: () => {
          this.snackBar.open('Candidato creado correctamente', 'Cerrar', {
            duration: 3000
          });
          this.dialogRef.close(true);
        },
        error: (error) => {
          this.snackBar.open('Error al crear el candidato', 'Cerrar', {
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
  selector: 'app-editar-candidato-dialog',
  standalone: true,
  imports: [
    CommonModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    ReactiveFormsModule
  ],
  template: `
    <h2 mat-dialog-title>Editar Candidato</h2>
    <form [formGroup]="form" (ngSubmit)="onSubmit()">
      <mat-dialog-content>
        <mat-form-field appearance="outline" class="full-width">
          <mat-label>Nombre</mat-label>
          <input matInput formControlName="nombre" required>
          <mat-error *ngIf="form.get('nombre')?.hasError('required')">
            El nombre es requerido
          </mat-error>
        </mat-form-field>

        <mat-form-field appearance="outline" class="full-width">
          <mat-label>Apellido</mat-label>
          <input matInput formControlName="apellido" required>
          <mat-error *ngIf="form.get('apellido')?.hasError('required')">
            El apellido es requerido
          </mat-error>
        </mat-form-field>

        <mat-form-field appearance="outline" class="full-width">
          <mat-label>Documento de Identidad</mat-label>
          <input matInput formControlName="documento_identidad" required>
          <mat-error *ngIf="form.get('documento_identidad')?.hasError('required')">
            El documento es requerido
          </mat-error>
        </mat-form-field>

        <mat-form-field appearance="outline" class="full-width">
          <mat-label>Correo Electrónico</mat-label>
          <input matInput formControlName="correo" type="email" required>
          <mat-error *ngIf="form.get('correo')?.hasError('required')">
            El correo es requerido
          </mat-error>
          <mat-error *ngIf="form.get('correo')?.hasError('email')">
            Ingrese un correo válido
          </mat-error>
        </mat-form-field>

        <mat-form-field appearance="outline" class="full-width">
          <mat-label>Teléfono</mat-label>
          <input matInput formControlName="telefono">
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
export class EditarCandidatoDialogComponent {
  form: FormGroup;

  constructor(
    public dialogRef: MatDialogRef<EditarCandidatoDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private fb: FormBuilder,
    private candidatoService: CandidatoService,
    private snackBar: MatSnackBar
  ) {
    this.form = this.fb.group({
      nombre: [data.candidato.nombre, Validators.required],
      apellido: [data.candidato.apellido, Validators.required],
      documento_identidad: [data.candidato.documento_identidad, Validators.required],
      correo: [data.candidato.correo, [Validators.required, Validators.email]],
      telefono: [data.candidato.telefono]
    });
  }

  onSubmit(): void {
    if (this.form.valid) {
      this.candidatoService.updateCandidato(this.data.candidato.id, this.form.value).subscribe({
        next: () => {
          this.snackBar.open('Candidato actualizado correctamente', 'Cerrar', {
            duration: 3000
          });
          this.dialogRef.close(true);
        },
        error: (error) => {
          this.snackBar.open('Error al actualizar el candidato', 'Cerrar', {
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
  selector: 'app-detalles-candidato-dialog',
  standalone: true,
  imports: [
    CommonModule,
    MatDialogModule,
    MatButtonModule,
    MatIconModule
  ],
  template: `
    <h2 mat-dialog-title>Detalles del Candidato</h2>
    <mat-dialog-content>
      <div class="detalles-container">
        <div class="detalle-item">
          <mat-icon class="detalle-icon">person</mat-icon>
          <div class="detalle-info">
            <span class="detalle-label">Nombre Completo</span>
            <span class="detalle-valor">{{data.candidato.nombre}} {{data.candidato.apellido}}</span>
          </div>
        </div>

        <div class="detalle-item">
          <mat-icon class="detalle-icon">badge</mat-icon>
          <div class="detalle-info">
            <span class="detalle-label">Documento de Identidad</span>
            <span class="detalle-valor">{{data.candidato.documento_identidad}}</span>
          </div>
        </div>

        <div class="detalle-item">
          <mat-icon class="detalle-icon">email</mat-icon>
          <div class="detalle-info">
            <span class="detalle-label">Correo Electrónico</span>
            <span class="detalle-valor">{{data.candidato.correo}}</span>
          </div>
        </div>

        <div class="detalle-item">
          <mat-icon class="detalle-icon">phone</mat-icon>
          <div class="detalle-info">
            <span class="detalle-label">Teléfono</span>
            <span class="detalle-valor">{{data.candidato.telefono || 'No especificado'}}</span>
          </div>
        </div>

        <div class="detalle-item">
          <mat-icon class="detalle-icon">event</mat-icon>
          <div class="detalle-info">
            <span class="detalle-label">Fecha de Registro</span>
            <span class="detalle-valor">{{data.candidato.created_at | date:'medium'}}</span>
          </div>
        </div>
      </div>
    </mat-dialog-content>

    <mat-dialog-actions align="end">
      <button mat-button (click)="onClose()">Cerrar</button>
    </mat-dialog-actions>
  `,
  styles: [`
    mat-dialog-content {
      padding: 20px;
    }

    .detalles-container {
      display: flex;
      flex-direction: column;
      gap: 16px;
    }

    .detalle-item {
      display: flex;
      align-items: center;
      gap: 12px;
      padding: 12px;
      background-color: #f8f9fa;
      border-radius: 8px;
    }

    .detalle-icon {
      color: var(--accent-color);
      font-size: 24px;
      width: 24px;
      height: 24px;
    }

    .detalle-info {
      display: flex;
      flex-direction: column;
    }

    .detalle-label {
      font-size: 12px;
      color: var(--text-secondary);
      margin-bottom: 4px;
    }

    .detalle-valor {
      font-size: 14px;
      color: var(--text-primary);
      font-weight: 500;
    }

    mat-dialog-actions {
      padding: 16px;
    }
  `]
})
export class DetallesCandidatoDialogComponent {
  constructor(
    public dialogRef: MatDialogRef<DetallesCandidatoDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {}

  onClose(): void {
    this.dialogRef.close();
  }
} 