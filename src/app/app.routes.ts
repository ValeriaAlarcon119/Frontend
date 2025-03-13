import { Routes } from '@angular/router';
import { CandidatosComponent } from './candidatos/candidatos.component';
import { TiposEstudioComponent } from './tipos-estudio/tipos-estudio.component';

export const routes: Routes = [
  { path: '', redirectTo: 'candidatos', pathMatch: 'full' },
  { path: 'candidatos', component: CandidatosComponent },
  { path: 'tipos-estudio', component: TiposEstudioComponent }
];
