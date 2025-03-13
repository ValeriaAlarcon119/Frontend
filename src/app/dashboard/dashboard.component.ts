import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  conteoSolicitudes: { [key: string]: number } = {};
  estados: string[] = ['pendiente', 'en_proceso', 'completado'];

  constructor(private http: HttpClient, private router: Router) {}

  ngOnInit(): void {
    this.cargarConteoSolicitudes();
  }

  cargarConteoSolicitudes(): void {
    const estados = ['pendiente', 'en_proceso', 'completado'];
    estados.forEach(estado => {
      this.http.get<any[]>(`http://localhost:8000/api/solicitudes?estado=${estado}`).subscribe({
        next: (data) => {
          this.conteoSolicitudes[estado] = data.length;
        },
        error: (error) => {
          console.error(`Error al cargar solicitudes para el estado ${estado}`, error);
        }
      });
    });
  }

  getColor(estado: string): string {
    switch (estado) {
      case 'pendiente':
        return '#f39c12'; 
      case 'en_proceso':
        return '#3498db'; 
      case 'completado':
        return '#2ecc71';
      default:
        return '#bdc3c7'; 
    }
  }

  navigateToCrearSolicitud(): void {
    this.router.navigate(['/crear-solicitud']);
  }

  navigateToSolicitudes(): void {
    this.router.navigate(['/solicitudes']);
  }

  navigateToCandidatos(): void {
    this.router.navigate(['/candidatos']);
  }

  navigateToTiposEstudio(): void {
    this.router.navigate(['/tipos-estudio']);
  }
}
