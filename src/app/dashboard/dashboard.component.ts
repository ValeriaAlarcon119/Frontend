import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBarModule, MatSnackBar } from '@angular/material/snack-bar';
import { Chart, ChartConfiguration, ChartData, ChartType, registerables } from 'chart.js';
import { SolicitudService } from '../services/solicitud.service';
import { CandidatoService } from '../services/candidato.service';
import { TipoEstudioService } from '../services/tipo-estudio.service';
import { AuthService } from '../services/auth.service';
import { MatTableModule } from '@angular/material/table';
import { trigger, transition, style, animate, state } from '@angular/animations';

Chart.register(...registerables);

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MatCardModule,
    MatIconModule,
    MatButtonModule,
    MatProgressSpinnerModule,
    MatSnackBarModule,
    MatTableModule
  ],
  animations: [
    trigger('fadeIn', [
      state('void', style({ opacity: 0, transform: 'translateY(20px)' })),
      transition(':enter', [
        animate('0.4s ease-out', style({ opacity: 1, transform: 'translateY(0)' }))
      ])
    ]),
    trigger('scaleIn', [
      state('void', style({ transform: 'scale(0.95)', opacity: 0 })),
      transition(':enter', [
        animate('0.3s ease-out', style({ transform: 'scale(1)', opacity: 1 }))
      ])
    ]),
    trigger('slideIn', [
      state('void', style({ transform: 'translateX(-20px)', opacity: 0 })),
      transition(':enter', [
        animate('0.4s ease-out', style({ transform: 'translateX(0)', opacity: 1 }))
      ])
    ]),
    trigger('cardHover', [
      state('normal', style({
        transform: 'translateY(0)',
        boxShadow: '0 4px 6px var(--shadow-color)'
      })),
      state('hover', style({
        transform: 'translateY(-8px)',
        boxShadow: '0 8px 15px var(--shadow-color)'
      })),
      transition('normal => hover', [
        animate('0.3s cubic-bezier(0.4, 0, 0.2, 1)')
      ]),
      transition('hover => normal', [
        animate('0.2s cubic-bezier(0.4, 0, 0.2, 1)')
      ])
    ]),
    trigger('iconPulse', [
      state('normal', style({
        transform: 'scale(1)'
      })),
      state('hover', style({
        transform: 'scale(1.1)'
      })),
      transition('normal => hover', [
        animate('0.3s cubic-bezier(0.4, 0, 0.2, 1)')
      ]),
      transition('hover => normal', [
        animate('0.2s cubic-bezier(0.4, 0, 0.2, 1)')
      ])
    ])
  ],
  template: `
    <div class="dashboard-container">
      <div class="dashboard-header" @fadeIn>
        <h1>Dashboard</h1>
        <div class="header-actions">
          <button mat-raised-button class="action-button solicitudes" routerLink="/solicitudes">
            <mat-icon>description</mat-icon>
            Solicitudes
          </button>
          <button mat-raised-button class="action-button candidatos" routerLink="/candidatos">
            <mat-icon>people</mat-icon>
            Candidatos
          </button>
          <button mat-raised-button class="action-button tipos" routerLink="/tipos-estudio">
            <mat-icon>school</mat-icon>
            Tipos de Estudio
          </button>
        </div>
      </div>

      <div class="stats-grid" @fadeIn>
        <mat-card class="stat-card solicitudes" routerLink="/solicitudes">
          <mat-card-content>
            <div class="stat-icon">
              <mat-icon>description</mat-icon>
            </div>
            <div class="stat-info">
              <h3>Total Solicitudes</h3>
              <p class="stat-number">{{ totalSolicitudes }}</p>
            </div>
          </mat-card-content>
        </mat-card>

        <mat-card class="stat-card candidatos" routerLink="/candidatos">
          <mat-card-content>
            <div class="stat-icon">
              <mat-icon>people</mat-icon>
            </div>
            <div class="stat-info">
              <h3>Total Candidatos</h3>
              <p class="stat-number">{{ totalCandidatos }}</p>
            </div>
          </mat-card-content>
        </mat-card>

        <mat-card class="stat-card tipos" routerLink="/tipos-estudio">
          <mat-card-content>
            <div class="stat-icon">
              <mat-icon>school</mat-icon>
            </div>
            <div class="stat-info">
              <h3>Tipos de Estudio</h3>
              <p class="stat-number">{{ totalTiposEstudio }}</p>
            </div>
          </mat-card-content>
        </mat-card>
      </div>

      <div class="dashboard-content">
        <div class="charts-container">
          <mat-card class="chart-card pie-chart">
            <mat-card-header>
              <mat-card-title>Distribución de Solicitudes</mat-card-title>
              <mat-card-subtitle>Gráfico Circular</mat-card-subtitle>
            </mat-card-header>
            <mat-card-content>
              <canvas id="solicitudesPieChart"></canvas>
            </mat-card-content>
          </mat-card>

          <mat-card class="chart-card bar-chart">
            <mat-card-header>
              <mat-card-title>Distribución de Solicitudes</mat-card-title>
              <mat-card-subtitle>Gráfico de Barras</mat-card-subtitle>
            </mat-card-header>
            <mat-card-content>
              <canvas id="solicitudesBarChart"></canvas>
            </mat-card-content>
          </mat-card>

          <mat-card class="table-card">
            <mat-card-header>
              <mat-card-title>Resumen por Estado</mat-card-title>
              <mat-card-subtitle>Detalle de Solicitudes</mat-card-subtitle>
            </mat-card-header>
            <mat-card-content>
              <table mat-table [dataSource]="estadosResumen" class="mat-elevation-z2">
                <ng-container matColumnDef="estado">
                  <th mat-header-cell *matHeaderCellDef>Estado</th>
                  <td mat-cell *matCellDef="let elemento">
                    <div class="estado-cell">
                      <div class="estado-color" [style.background-color]="getEstadoColor(elemento.estado)"></div>
                      {{ elemento.estadoFormateado }}
                    </div>
                  </td>
                </ng-container>

                <ng-container matColumnDef="cantidad">
                  <th mat-header-cell *matHeaderCellDef>Cantidad</th>
                  <td mat-cell *matCellDef="let elemento">{{ elemento.cantidad }}</td>
                </ng-container>

                <ng-container matColumnDef="porcentaje">
                  <th mat-header-cell *matHeaderCellDef>%</th>
                  <td mat-cell *matCellDef="let elemento">{{ elemento.porcentaje }}%</td>
                </ng-container>

                <tr mat-header-row *matHeaderRowDef="columnasResumen"></tr>
                <tr mat-row *matRowDef="let row; columns: columnasResumen;"></tr>
              </table>
            </mat-card-content>
          </mat-card>
        </div>
      </div>

      <div class="loading-overlay" *ngIf="loading">
        <mat-spinner></mat-spinner>
      </div>
    </div>
  `,
  styles: [`
    :host {
      --primary-color: #2c3e50;    /* Azul oscuro */
      --secondary-color: #34495e;  /* Azul grisáceo */
      --accent-color: #3498db;     /* Azul brillante */
      --success-color: #9b59b6;    /* Morado elegante */
      --warning-color: #e84393;    /* Rosa vibrante */
      --danger-color: #e74c3c;     /* Rojo */
      --info-color: #2980b9;       /* Azul info */
      --purple-light: #a29bfe;     /* Morado claro */
      --purple-dark: #6c5ce7;      /* Morado oscuro */
      --blue-gradient-start: #3498db;  /* Azul para gradiente */
      --blue-gradient-end: #2980b9;    /* Azul oscuro para gradiente */
      --purple-gradient-start: #9b59b6; /* Morado para gradiente */
      --purple-gradient-end: #8e44ad;   /* Morado oscuro para gradiente */
      --pink-gradient-start: #e84393;   /* Rosa para gradiente */
      --pink-gradient-end: #c0392b;     /* Rosa oscuro para gradiente */
      --background-color: #f5f6fa;
      --card-background: #ffffff;
      --text-primary: #2c3e50;
      --text-secondary: #7f8c8d;
      --border-color: #ecf0f1;
      --hover-color: #f8f9fa;
      --shadow-color: rgba(0, 0, 0, 0.1);
    }

    .dashboard-container {
      padding: 24px;
      position: relative;
      min-height: 100vh;
      background-color: var(--background-color);
    }

    .dashboard-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 32px;
      flex-wrap: wrap;
      gap: 16px;
    }

    .dashboard-header h1 {
      margin: 0;
      color: var(--primary-color);
      font-size: 2.2rem;
      font-weight: 600;
      letter-spacing: -0.5px;
    }

    .header-actions {
      display: flex;
      gap: 12px;
      flex-wrap: wrap;
    }

    .action-button {
      display: flex;
      align-items: center;
      gap: 6px;
      padding: 8px 16px;
      font-weight: 500;
      transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
      border-radius: 6px;
      box-shadow: 0 2px 4px var(--shadow-color);
      border: none;
      font-size: 0.9rem;
      letter-spacing: 0.3px;
      min-width: 120px;
      justify-content: center;
      text-transform: none;
      position: relative;
      overflow: hidden;
      transform: translateY(0);
    }

    .action-button::before {
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: linear-gradient(rgba(255, 255, 255, 0.1), rgba(255, 255, 255, 0));
      opacity: 0;
      transition: opacity 0.3s ease;
    }

    .action-button:hover {
      transform: translateY(-2px);
      box-shadow: 0 4px 12px var(--shadow-color);
    }

    .action-button:hover::before {
      opacity: 1;
    }

    .action-button mat-icon {
      font-size: 18px;
      width: 18px;
      height: 18px;
      margin-right: 2px;
    }

    .action-button.solicitudes {
      background: #3498db;  /* Azul de las solicitudes */
      color: white;
      border: 1px solid rgba(255, 255, 255, 0.2);
    }

    .action-button.candidatos {
      background: #9b59b6;  /* Morado de los candidatos */
      color: white;
      border: 1px solid rgba(255, 255, 255, 0.2);
    }

    .action-button.tipos {
      background: #e84393;  /* Rosa de los tipos de estudio */
      color: white;
      border: 1px solid rgba(255, 255, 255, 0.2);
    }

    .action-button.solicitudes:hover {
      background: #2980b9;  /* Azul más oscuro */
    }

    .action-button.candidatos:hover {
      background: #8e44ad;  /* Morado más oscuro */
    }

    .action-button.tipos:hover {
      background: #c0392b;  /* Rosa más oscuro */
    }

    .stats-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
      gap: 24px;
      margin-bottom: 32px;
    }

    .stat-card {
      background: var(--card-background);
      border-radius: 12px;
      cursor: pointer;
      transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
      border: none;
      overflow: hidden;
      position: relative;
      box-shadow: 0 4px 6px var(--shadow-color);
      transform: translateY(0);
    }

    .stat-card:hover {
      transform: translateY(-8px);
      box-shadow: 0 8px 15px var(--shadow-color);
    }

    .stat-icon {
      background: rgba(44, 62, 80, 0.05);
      border-radius: 12px;
      width: 56px;
      height: 56px;
      display: flex;
      align-items: center;
      justify-content: center;
      margin-right: 20px;
      transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    }

    .stat-card:hover .stat-icon {
      transform: scale(1.1);
    }

    .stat-info h3 {
      margin: 0;
      font-size: 1.1rem;
      font-weight: 500;
      color: var(--text-secondary);
    }

    .stat-number {
      margin: 8px 0 0;
      font-size: 2rem;
      font-weight: 600;
      color: var(--text-primary);
    }

    .dashboard-content {
      margin-top: 24px;
    }

    .charts-container {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 24px;
      align-items: start;
    }

    .chart-card, .table-card {
      background: var(--card-background);
      border-radius: 12px;
      box-shadow: 0 4px 6px var(--shadow-color);
      transition: all 0.3s ease;
      height: 400px;
      overflow: hidden;
    }

    .chart-card:hover, .table-card:hover {
      box-shadow: 0 8px 15px var(--shadow-color);
    }

    mat-card-header {
      padding: 20px;
      border-bottom: 1px solid var(--border-color);
      background: linear-gradient(to right, var(--card-background), var(--hover-color));
    }

    mat-card-title {
      font-size: 1.1rem;
      font-weight: 600;
      color: var(--text-primary);
      margin-bottom: 4px;
    }

    mat-card-subtitle {
      font-size: 0.9rem;
      color: var(--text-secondary);
    }

    .estado-cell {
      display: flex;
      align-items: center;
      gap: 8px;
      white-space: nowrap;
    }

    .estado-color {
      width: 10px;
      height: 10px;
      border-radius: 50%;
      flex-shrink: 0;
    }

    th.mat-header-cell {
      font-weight: bold;
      color: var(--primary-color);
      padding: 8px 16px;
      font-size: 14px;
    }

    td.mat-cell {
      padding: 8px 16px;
      font-size: 14px;
    }

    canvas {
      width: 100% !important;
      height: calc(100% - 80px) !important;
    }

    .loading-overlay {
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: rgba(255, 255, 255, 0.8);
      display: flex;
      justify-content: center;
      align-items: center;
      z-index: 1000;
    }

    @media (max-width: 1400px) {
      .charts-container {
        grid-template-columns: repeat(2, 1fr);
      }

      .pie-chart {
        grid-column: 1;
      }

      .bar-chart {
        grid-column: 2;
      }

      .table-card {
        grid-column: 1 / span 2;
        height: 300px;
      }
    }

    @media (max-width: 900px) {
      .charts-container {
        grid-template-columns: 1fr;
      }

      .pie-chart, .bar-chart, .table-card {
        grid-column: 1;
      }

      .chart-card, .table-card {
        height: 350px;
      }
    }

    @media (max-width: 600px) {
      .chart-card, .table-card {
        height: 300px;
      }

      mat-card-title {
        font-size: 14px;
      }

      mat-card-subtitle {
        font-size: 11px;
      }

      th.mat-header-cell, td.mat-cell {
        padding: 6px 12px;
        font-size: 12px;
      }
    }
  `]
})
export class DashboardComponent implements OnInit {
  loading = false;
  totalSolicitudes = 0;
  totalCandidatos = 0;
  totalTiposEstudio = 0;
  solicitudesPieChart: Chart | null = null;
  solicitudesBarChart: Chart | null = null;
  columnasResumen: string[] = ['estado', 'cantidad', 'porcentaje'];
  estadosResumen: any[] = [];

  constructor(
    private solicitudService: SolicitudService,
    private candidatoService: CandidatoService,
    private tipoEstudioService: TipoEstudioService,
    private authService: AuthService,
    private router: Router,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.loading = true;
    this.loadDashboardData();
  }

  private loadDashboardData(): void {
    Promise.all([
      this.loadSolicitudes(),
      this.loadCandidatos(),
      this.loadTiposEstudio()
    ]).finally(() => {
      this.loading = false;
    });
  }

  private loadSolicitudes(): Promise<void> {
    return new Promise((resolve) => {
      this.solicitudService.getSolicitudes().subscribe({
        next: (solicitudes) => {
          this.totalSolicitudes = solicitudes.length;
          this.createSolicitudesCharts(solicitudes);
          resolve();
        },
        error: (error) => {
          this.showError('Error al cargar las solicitudes');
          resolve();
        }
      });
    });
  }

  private loadCandidatos(): Promise<void> {
    return new Promise((resolve) => {
      this.candidatoService.getCandidatos().subscribe({
        next: (candidatos) => {
          this.totalCandidatos = candidatos.length;
          resolve();
        },
        error: (error) => {
          this.showError('Error al cargar los candidatos');
          resolve();
        }
      });
    });
  }

  private loadTiposEstudio(): Promise<void> {
    return new Promise((resolve) => {
      this.tipoEstudioService.getTiposEstudio().subscribe({
        next: (tipos) => {
          this.totalTiposEstudio = tipos.length;
          resolve();
        },
        error: (error) => {
          this.showError('Error al cargar los tipos de estudio');
          resolve();
        }
      });
    });
  }

  private createSolicitudesCharts(solicitudes: any[]): void {
    const pieCtx = document.getElementById('solicitudesPieChart') as HTMLCanvasElement;
    const barCtx = document.getElementById('solicitudesBarChart') as HTMLCanvasElement;
    if (!pieCtx || !barCtx) return;

    // Calcular total de solicitudes
    const total = solicitudes.length;

    // Agrupar solicitudes por estado
    const estados = solicitudes.reduce((acc: Record<string, number>, solicitud) => {
      const estado = solicitud.estado || 'sin_estado';
      acc[estado] = (acc[estado] || 0) + 1;
      return acc;
    }, {});

    // Preparar datos para la tabla
    this.estadosResumen = Object.entries(estados).map(([estado, cantidad]) => ({
      estado,
      estadoFormateado: this.formatEstado(estado),
      cantidad,
      porcentaje: ((cantidad / total) * 100).toFixed(1)
    })).sort((a, b) => b.cantidad - a.cantidad);

    // Preparar datos para los gráficos
    const labels = Object.keys(estados).map(estado => {
      const cantidad = estados[estado];
      const porcentaje = ((cantidad / total) * 100).toFixed(1);
      return `${this.formatEstado(estado)} (${cantidad} - ${porcentaje}%)`;
    });

    const data = Object.values(estados);

    // Colores para cada estado
    const colores: Record<string, string> = {
      'pendiente': '#3498db',    // Azul profesional
      'en_proceso': '#2ecc71',   // Verde éxito
      'completado': '#9b59b6',   // Morado elegante
      'cancelado': '#e74c3c',    // Rojo
      'rechazado': '#e84393',    // Rosa vibrante
      'sin_estado': '#a29bfe'    // Morado claro
    };

    // Configuración del gráfico circular
    const pieConfig: ChartConfiguration<'pie'> = {
      type: 'pie',
      data: {
        labels: labels,
        datasets: [{
          data: data,
          backgroundColor: Object.keys(estados).map(estado => colores[estado] || '#CCCCCC'),
          borderColor: '#FFFFFF',
          borderWidth: 1
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            position: 'right',
            labels: {
              font: {
                size: 12
              }
            }
          },
          tooltip: {
            callbacks: {
              label: function(context) {
                const value = context.raw as number;
                const porcentaje = ((value / total) * 100).toFixed(1);
                return `${value} solicitudes (${porcentaje}%)`;
              }
            }
          }
        }
      }
    };

    // Configuración del gráfico de barras
    const barConfig: ChartConfiguration<'bar'> = {
      type: 'bar',
      data: {
        labels: labels,
        datasets: [{
          data: data,
          backgroundColor: Object.keys(estados).map(estado => colores[estado] || '#CCCCCC'),
          borderColor: Object.keys(estados).map(estado => colores[estado] || '#CCCCCC'),
          borderWidth: 1
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            display: false
          },
          tooltip: {
            callbacks: {
              label: function(context) {
                const value = context.raw as number;
                const porcentaje = ((value / total) * 100).toFixed(1);
                return `${value} solicitudes (${porcentaje}%)`;
              }
            }
          }
        },
        scales: {
          y: {
            beginAtZero: true,
            ticks: {
              stepSize: 1,
              callback: function(value) {
                return value + ' solicitudes';
              }
            }
          }
        }
      }
    };

    // Crear los gráficos
    this.solicitudesPieChart = new Chart(pieCtx, pieConfig);
    this.solicitudesBarChart = new Chart(barCtx, barConfig);
  }

  private formatEstado(estado: string): string {
    const estados: Record<string, string> = {
      'pendiente': 'Pendiente',
      'en_proceso': 'En Proceso',
      'completado': 'Completado',
      'cancelado': 'Cancelado',
      'rechazado': 'Rechazado',
      'sin_estado': 'Sin Estado'
    };
    return estados[estado] || estado;
  }

  getEstadoColor(estado: string): string {
    const colores: Record<string, string> = {
      'pendiente': '#3498db',    // Azul profesional
      'en_proceso': '#2ecc71',   // Verde éxito
      'completado': '#9b59b6',   // Morado elegante
      'cancelado': '#e74c3c',    // Rojo
      'rechazado': '#e84393',    // Rosa vibrante
      'sin_estado': '#a29bfe'    // Morado claro
    };
    return colores[estado] || '#a29bfe';
  }

  private showError(message: string): void {
    this.snackBar.open(message, 'Cerrar', {
      duration: 5000,
      horizontalPosition: 'center',
      verticalPosition: 'top',
      panelClass: ['error-snackbar']
    });
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}
