import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { environment } from '../../environments/environment';

export interface Solicitud {
  id: number;
  candidato_id: number;
  tipo_estudio_id: number;
  estado: 'pendiente' | 'en_proceso' | 'completado' | 'cancelado' | 'rechazado';
  fecha_solicitud: string | null;
  fecha_completado: string | null;
  observaciones?: string;
  created_at?: string;
  updated_at?: string;
  candidato?: {
    id: number;
    nombre: string;
    apellido: string;
    documento_identidad: string;
    correo: string;
    telefono?: string;
  };
  tipo_estudio?: {
    id: number;
    nombre: string;
    descripcion?: string;
    precio: number;
  };
}

@Injectable({
  providedIn: 'root'
})
export class SolicitudService {
  private apiUrl = `${environment.api_url}/solicitudes`;

  constructor(private http: HttpClient) {}

  private handleError(error: HttpErrorResponse) {
    let errorMessage = 'Ha ocurrido un error';
    
    if (error.error instanceof ErrorEvent) {
      // Error del cliente
      errorMessage = error.error.message;
    } else {
      // Error del servidor
      if (error.status === 422) {
        // Error de validación
        const validationErrors = error.error.errors;
        errorMessage = Object.values(validationErrors).flat().join('\n');
      } else if (error.error?.message) {
        errorMessage = error.error.message;
      }
    }
    
    console.error('Error en SolicitudService:', error);
    return throwError(() => new Error(errorMessage));
  }

  getSolicitudes(): Observable<Solicitud[]> {
    return this.http.get<Solicitud[]>(`${this.apiUrl}?include=candidato,tipo_estudio`)
      .pipe(catchError(this.handleError));
  }

  getSolicitud(id: number): Observable<Solicitud> {
    return this.http.get<Solicitud>(`${this.apiUrl}/${id}?include=candidato,tipo_estudio`)
      .pipe(catchError(this.handleError));
  }

  createSolicitud(solicitud: Partial<Solicitud>): Observable<Solicitud> {
    return this.http.post<Solicitud>(this.apiUrl, solicitud)
      .pipe(catchError(this.handleError));
  }

  updateSolicitud(id: number, solicitud: Partial<Solicitud>): Observable<Solicitud> {
    return this.http.put<Solicitud>(`${this.apiUrl}/${id}`, solicitud)
      .pipe(catchError(this.handleError));
  }

  deleteSolicitud(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`)
      .pipe(catchError(this.handleError));
  }

  cambiarEstado(id: number, estado: Solicitud['estado']): Observable<Solicitud> {
    return this.http.put<Solicitud>(`${this.apiUrl}/${id}/cambiar-estado`, { estado })
      .pipe(catchError(this.handleError));
  }
} 