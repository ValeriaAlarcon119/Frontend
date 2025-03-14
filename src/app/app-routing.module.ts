import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CandidatosComponent } from './candidatos/candidatos.component';
import { LoginComponent } from './login/login.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { SolicitudesComponent } from './solicitudes/solicitudes.component';
import { CrearSolicitudComponent } from './crear-solicitud/crear-solicitud.component';
import { TiposEstudioComponent } from './tipos-estudio/tipos-estudio.component';
import { RegisterComponent } from './register/register.component';

const routes: Routes = [
  { path: 'tipos-estudio', component: TiposEstudioComponent },
  { path: 'solicitudes', component: SolicitudesComponent },
  { path: 'candidatos', component: CandidatosComponent },
  { path: 'login', component: LoginComponent },
  { path: 'dashboard', component: DashboardComponent },
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
