import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CandidatosComponent } from './candidatos/candidatos.component';
import { LoginComponent } from './login/login.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { SolicitudesComponent } from './solicitudes/solicitudes.component';
import { CrearSolicitudComponent } from './crear-solicitud/crear-solicitud.component';
import { TiposEstudioComponent } from './tipos-estudio/tipos-estudio.component';
import { RegisterComponent } from './register/register.component';
import { AuthGuard } from './auth.guard';

const routes: Routes = [
  { path: 'tipos-estudio', component: TiposEstudioComponent, canActivate: [AuthGuard] },
  { path: 'solicitudes', component: SolicitudesComponent, canActivate: [AuthGuard] },
  { path: 'candidatos', component: CandidatosComponent, canActivate: [AuthGuard] },
  { path: 'login', component: LoginComponent },
  { path: 'dashboard', component: DashboardComponent, canActivate: [AuthGuard] },
  { path: 'crear-solicitud', component: CrearSolicitudComponent },
  { path: 'register', component: RegisterComponent },
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  { path: '**', redirectTo: '/login' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
