import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

export interface Candidato {
  id: number;
  nombre: string;
  email: string;
  telefono: string;
  direccion: string;
  created_at: string;
  updated_at: string;
}

@Injectable({
  providedIn: 'root'
})
export class CandidatoService {
  private apiUrl = `${environment.api_url}/candidatos`;

  constructor(private http: HttpClient) {}

  getCandidatos(): Observable<Candidato[]> {
    return this.http.get<Candidato[]>(this.apiUrl);
  }

  getCandidato(id: number): Observable<Candidato> {
    return this.http.get<Candidato>(`${this.apiUrl}/${id}`);
  }

  createCandidato(candidato: Partial<Candidato>): Observable<Candidato> {
    return this.http.post<Candidato>(this.apiUrl, candidato);
  }

  updateCandidato(id: number, candidato: Partial<Candidato>): Observable<Candidato> {
    return this.http.put<Candidato>(`${this.apiUrl}/${id}`, candidato);
  }

  deleteCandidato(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
