import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { environment } from '../../environments/environment';

export interface TipoEstudio {
  id: number;
  nombre: string;
  descripcion: string;
  precio: number;
  created_at?: string;
  updated_at?: string;
}

@Injectable({
  providedIn: 'root'
})
export class TipoEstudioService {
  private apiUrl = `${environment.api_url}/tipos-estudio`;

  constructor(private http: HttpClient) {}

  getTiposEstudio(): Observable<TipoEstudio[]> {
    return this.http.get<TipoEstudio[]>(this.apiUrl).pipe(
      catchError(error => {
        console.error('Error al obtener tipos de estudio:', error);
        return throwError(() => new Error('Error al cargar los tipos de estudio'));
      })
    );
  }

  getTipoEstudio(id: number): Observable<TipoEstudio> {
    return this.http.get<TipoEstudio>(`${this.apiUrl}/${id}`).pipe(
      catchError(error => {
        console.error('Error al obtener tipo de estudio:', error);
        return throwError(() => new Error('Error al cargar el tipo de estudio'));
      })
    );
  }

  createTipoEstudio(tipoEstudio: Partial<TipoEstudio>): Observable<TipoEstudio> {
    return this.http.post<TipoEstudio>(this.apiUrl, tipoEstudio).pipe(
      catchError(error => {
        console.error('Error al crear tipo de estudio:', error);
        if (error.status === 422) {
          return throwError(() => new Error('Datos inválidos para el tipo de estudio'));
        }
        return throwError(() => new Error('Error al crear el tipo de estudio'));
      })
    );
  }

  updateTipoEstudio(id: number, tipoEstudio: Partial<TipoEstudio>): Observable<TipoEstudio> {
    return this.http.put<TipoEstudio>(`${this.apiUrl}/${id}`, tipoEstudio).pipe(
      catchError(error => {
        console.error('Error al actualizar tipo de estudio:', error);
        if (error.status === 422) {
          return throwError(() => new Error('Datos inválidos para el tipo de estudio'));
        }
        return throwError(() => new Error('Error al actualizar el tipo de estudio'));
      })
    );
  }

  deleteTipoEstudio(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`).pipe(
      catchError(error => {
        console.error('Error al eliminar tipo de estudio:', error);
        if (error.status === 422) {
          return throwError(() => new Error('No se puede eliminar este tipo de estudio porque está en uso'));
        }
        return throwError(() => new Error('Error al eliminar el tipo de estudio'));
      })
    );
  }
} 