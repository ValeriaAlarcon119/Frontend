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
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { TipoEstudioService } from '../services/tipo-estudio.service';

@Component({
  selector: 'app-tipos-estudio',
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
    ReactiveFormsModule
  ],
  template: `
    <div class="tipos-estudio-container">
      <div class="header">
        <h1>Tipos de Estudio</h1>
        <button mat-raised-button color="primary" (click)="abrirDialogoNuevoTipoEstudio()">
          <mat-icon>add</mat-icon>
          Nuevo Tipo de Estudio
        </button>
      </div>

      <mat-card>
        <mat-card-content>
          <div class="table-container">
            <table mat-table [dataSource]="tiposEstudio" class="mat-elevation-z0">
              <!-- ID Column -->
              <ng-container matColumnDef="id">
                <th mat-header-cell *matHeaderCellDef>ID</th>
                <td mat-cell *matCellDef="let tipo">{{tipo.id}}</td>
              </ng-container>

              <!-- Nombre Column -->
              <ng-container matColumnDef="nombre">
                <th mat-header-cell *matHeaderCellDef>Nombre</th>
                <td mat-cell *matCellDef="let tipo">{{tipo.nombre}}</td>
              </ng-container>

              <!-- Descripción Column -->
              <ng-container matColumnDef="descripcion">
                <th mat-header-cell *matHeaderCellDef>Descripción</th>
                <td mat-cell *matCellDef="let tipo">{{tipo.descripcion || 'Sin descripción'}}</td>
              </ng-container>

              <!-- Precio Column -->
              <ng-container matColumnDef="precio">
                <th mat-header-cell *matHeaderCellDef>Precio</th>
                <td mat-cell *matCellDef="let tipo">{{tipo.precio | currency}}</td>
              </ng-container>

              <!-- Actions Column -->
              <ng-container matColumnDef="actions">
                <th mat-header-cell *matHeaderCellDef>Acciones</th>
                <td mat-cell *matCellDef="let tipo">
                  <button mat-icon-button color="primary" (click)="editarTipoEstudio(tipo)" matTooltip="Editar">
                    <mat-icon>edit</mat-icon>
                  </button>
                  <button mat-icon-button color="warn" (click)="eliminarTipoEstudio(tipo)" matTooltip="Eliminar">
                    <mat-icon>delete</mat-icon>
                  </button>
                </td>
              </ng-container>

              <tr mat-header-row *matHeaderRowDef="displayedColumns"></tr>
              <tr mat-row *matRowDef="let row; columns: displayedColumns;"></tr>
            </table>

            <div class="loading-shade" *ngIf="loading">
              <mat-spinner></mat-spinner>
            </div>

            <div class="no-data" *ngIf="!loading && tiposEstudio.length === 0">
              <mat-icon>school</mat-icon>
              <p>No hay tipos de estudio registrados</p>
              <button mat-raised-button color="primary" (click)="abrirDialogoNuevoTipoEstudio()">
                <mat-icon>add</mat-icon>
                Crear Primer Tipo de Estudio
              </button>
            </div>
          </div>
        </mat-card-content>
      </mat-card>
    </div>
  `,
  styles: [`
    .tipos-estudio-container {
      padding: 24px;
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
    }

    .table-container {
      position: relative;
      min-height: 200px;
    }

    table {
      width: 100%;
    }

    .mat-mdc-row:hover {
      background-color: var(--hover-color);
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
    }

    .no-data mat-icon {
      font-size: 48px;
      width: 48px;
      height: 48px;
      margin-bottom: 16px;
    }

    .no-data p {
      margin: 0;
      font-size: 1.1rem;
    }

    @media (max-width: 600px) {
      .tipos-estudio-container {
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
    }
  `]
})
export class TiposEstudioComponent implements OnInit {
  tiposEstudio: any[] = [];
  displayedColumns: string[] = ['id', 'nombre', 'descripcion', 'precio', 'actions'];
  loading = false;

  constructor(
    private tipoEstudioService: TipoEstudioService,
    private dialog: MatDialog,
    private snackBar: MatSnackBar,
    private fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.cargarTiposEstudio();
  }

  private cargarTiposEstudio(): void {
    this.loading = true;
    this.tipoEstudioService.getTiposEstudio().subscribe({
      next: (tipos) => {
        this.tiposEstudio = tipos;
        this.loading = false;
      },
      error: (error) => {
        this.showError('Error al cargar los tipos de estudio');
        this.loading = false;
      }
    });
  }

  abrirDialogoNuevoTipoEstudio(): void {
    const dialogRef = this.dialog.open(NuevoTipoEstudioDialogComponent, {
      width: '500px',
      data: {}
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.cargarTiposEstudio();
      }
    });
  }

  editarTipoEstudio(tipo: any): void {
    const dialogRef = this.dialog.open(EditarTipoEstudioDialogComponent, {
      width: '500px',
      data: { tipo }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.cargarTiposEstudio();
      }
    });
  }

  eliminarTipoEstudio(tipo: any): void {
    if (confirm('¿Está seguro de que desea eliminar este tipo de estudio?')) {
      this.tipoEstudioService.deleteTipoEstudio(tipo.id).subscribe({
        next: () => {
          this.showSuccess('Tipo de estudio eliminado con éxito');
          this.cargarTiposEstudio();
        },
        error: (error) => {
          if (error.status === 422) {
            this.showError('No se puede eliminar este tipo de estudio porque está en uso');
          } else {
            this.showError('Error al eliminar el tipo de estudio');
          }
        }
      });
    }
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
      duration: 5000,
      horizontalPosition: 'center',
      verticalPosition: 'top',
      panelClass: ['success-snackbar']
    });
  }
}

@Component({
  selector: 'app-nuevo-tipo-estudio-dialog',
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
    <h2 mat-dialog-title>Nuevo Tipo de Estudio</h2>
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
          <mat-label>Descripción</mat-label>
          <textarea matInput formControlName="descripcion" rows="3"></textarea>
        </mat-form-field>

        <mat-form-field appearance="outline" class="full-width">
          <mat-label>Precio</mat-label>
          <input matInput type="number" formControlName="precio" required>
          <mat-error *ngIf="form.get('precio')?.hasError('required')">
            El precio es requerido
          </mat-error>
          <mat-error *ngIf="form.get('precio')?.hasError('min')">
            El precio debe ser mayor a 0
          </mat-error>
        </mat-form-field>
      </mat-dialog-content>

      <mat-dialog-actions align="end">
        <button mat-button type="button" (click)="onCancel()">Cancelar</button>
        <button mat-raised-button color="primary" type="submit" [disabled]="form.invalid">
          Crear Tipo de Estudio
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
export class NuevoTipoEstudioDialogComponent {
  form: FormGroup;

  constructor(
    private dialogRef: MatDialogRef<NuevoTipoEstudioDialogComponent>,
    private tipoEstudioService: TipoEstudioService,
    private fb: FormBuilder,
    private snackBar: MatSnackBar
  ) {
    this.form = this.fb.group({
      nombre: ['', Validators.required],
      descripcion: [''],
      precio: ['', [Validators.required, Validators.min(0)]]
    });
  }

  onSubmit(): void {
    if (this.form.valid) {
      this.tipoEstudioService.createTipoEstudio(this.form.value).subscribe({
        next: () => {
          this.snackBar.open('Tipo de estudio creado con éxito', 'Cerrar', {
            duration: 5000,
            horizontalPosition: 'center',
            verticalPosition: 'top'
          });
          this.dialogRef.close(true);
        },
        error: (error) => {
          this.snackBar.open('Error al crear el tipo de estudio', 'Cerrar', {
            duration: 5000,
            horizontalPosition: 'center',
            verticalPosition: 'top',
            panelClass: ['error-snackbar']
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
  selector: 'app-editar-tipo-estudio-dialog',
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
    <h2 mat-dialog-title>Editar Tipo de Estudio</h2>
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
          <mat-label>Descripción</mat-label>
          <textarea matInput formControlName="descripcion" rows="3"></textarea>
        </mat-form-field>

        <mat-form-field appearance="outline" class="full-width">
          <mat-label>Precio</mat-label>
          <input matInput type="number" formControlName="precio" required>
          <mat-error *ngIf="form.get('precio')?.hasError('required')">
            El precio es requerido
          </mat-error>
          <mat-error *ngIf="form.get('precio')?.hasError('min')">
            El precio debe ser mayor a 0
          </mat-error>
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
export class EditarTipoEstudioDialogComponent {
  form: FormGroup;

  constructor(
    private dialogRef: MatDialogRef<EditarTipoEstudioDialogComponent>,
    private tipoEstudioService: TipoEstudioService,
    private fb: FormBuilder,
    private snackBar: MatSnackBar,
    @Inject(MAT_DIALOG_DATA) public data: { tipo: any }
  ) {
    this.form = this.fb.group({
      nombre: [data.tipo.nombre, Validators.required],
      descripcion: [data.tipo.descripcion],
      precio: [data.tipo.precio, [Validators.required, Validators.min(0)]]
    });
  }

  onSubmit(): void {
    if (this.form.valid) {
      this.tipoEstudioService.updateTipoEstudio(this.data.tipo.id, this.form.value).subscribe({
        next: () => {
          this.snackBar.open('Tipo de estudio actualizado con éxito', 'Cerrar', {
            duration: 5000,
            horizontalPosition: 'center',
            verticalPosition: 'top'
          });
          this.dialogRef.close(true);
        },
        error: (error) => {
          this.snackBar.open('Error al actualizar el tipo de estudio', 'Cerrar', {
            duration: 5000,
            horizontalPosition: 'center',
            verticalPosition: 'top',
            panelClass: ['error-snackbar']
          });
        }
      });
    }
  }

  onCancel(): void {
    this.dialogRef.close();
  }
}
