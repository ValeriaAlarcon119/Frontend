import { Routes } from '@angular/router';
import { AuthGuard } from './guards/auth.guard';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full'
  },
  {
    path: 'login',
    loadComponent: () => import('./login/login.component').then(m => m.LoginComponent)
  },
  {
    path: 'register',
    loadComponent: () => import('./register/register.component').then(m => m.RegisterComponent)
  },
  {
    path: 'dashboard',
    loadComponent: () => import('./dashboard/dashboard.component').then(m => m.DashboardComponent),
    canActivate: [AuthGuard]
  },
  {
    path: 'solicitudes',
    loadComponent: () => import('./solicitudes/solicitudes.component').then(m => m.SolicitudesComponent),
    canActivate: [AuthGuard]
  },
  {
    path: 'candidatos',
    loadComponent: () => import('./candidatos/candidatos.component').then(m => m.CandidatosComponent),
    canActivate: [AuthGuard]
  },
  {
    path: 'tipos-estudio',
    loadComponent: () => import('./tipos-estudio/tipos-estudio.component').then(m => m.TiposEstudioComponent),
    canActivate: [AuthGuard]
  },
  {
    path: '**',
    redirectTo: 'login'
  }
];
