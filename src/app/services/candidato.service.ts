import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Candidato } from '../models/candidato.model';

@Injectable({
  providedIn: 'root'
})
export class CandidatoService {
  private apiUrl = 'http://localhost:8000/api/candidatos';

  constructor(private http: HttpClient) {}

  getCandidatos(): Observable<Candidato[]> {
    return this.http.get<Candidato[]>(this.apiUrl);
  }
}
