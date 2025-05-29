import { Component, ViewChild } from '@angular/core';
import { RouterOutlet, RouterLink, RouterLinkActive } from '@angular/router';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatSidenavModule, MatSidenav } from '@angular/material/sidenav';
import { MatListModule } from '@angular/material/list';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { AuthService } from './services/auth.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    CommonModule,
    RouterOutlet,
    RouterLink,
    RouterLinkActive,
    MatToolbarModule,
    MatSidenavModule,
    MatListModule,
    MatIconModule,
    MatButtonModule
  ],
  template: `
    <div class="app-container">
      <mat-toolbar color="primary" *ngIf="authService.isLoggedIn()">
        <button mat-icon-button (click)="toggleSidenav()">
          <mat-icon>menu</mat-icon>
        </button>
        <span>Sistema de Gestión de Estudios</span>
        <span class="toolbar-spacer"></span>
        <button mat-icon-button (click)="logout()">
          <mat-icon>logout</mat-icon>
        </button>
      </mat-toolbar>

      <mat-sidenav-container *ngIf="authService.isLoggedIn()">
        <mat-sidenav #sidenav mode="side" opened>
          <mat-nav-list>
            <a mat-list-item routerLink="/dashboard" routerLinkActive="active">
              <mat-icon matListItemIcon>dashboard</mat-icon>
              <span matListItemTitle>Dashboard</span>
            </a>
            <a mat-list-item routerLink="/solicitudes" routerLinkActive="active">
              <mat-icon matListItemIcon>description</mat-icon>
              <span matListItemTitle>Solicitudes</span>
            </a>
            <a mat-list-item routerLink="/candidatos" routerLinkActive="active">
              <mat-icon matListItemIcon>people</mat-icon>
              <span matListItemTitle>Candidatos</span>
            </a>
            <a mat-list-item routerLink="/tipos-estudio" routerLinkActive="active">
              <mat-icon matListItemIcon>school</mat-icon>
              <span matListItemTitle>Tipos de Estudio</span>
            </a>
          </mat-nav-list>
        </mat-sidenav>

        <mat-sidenav-content>
          <div class="content-container">
            <router-outlet></router-outlet>
          </div>
        </mat-sidenav-content>
      </mat-sidenav-container>

      <div class="auth-container" *ngIf="!authService.isLoggedIn()">
        <router-outlet></router-outlet>
      </div>
    </div>
  `,
  styles: [`
    .app-container {
      display: flex;
      flex-direction: column;
      height: 100vh;
    }

    mat-toolbar {
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      z-index: 2;
    }

    .toolbar-spacer {
      flex: 1 1 auto;
    }

    mat-sidenav-container {
      flex: 1;
      margin-top: 64px;
    }

    mat-sidenav {
      width: 250px;
      background-color: var(--background-color);
      border-right: 1px solid var(--border-color);
    }

    .content-container {
      padding: 20px;
      height: calc(100vh - 64px);
      overflow-y: auto;
    }

    .auth-container {
      height: 100vh;
      display: flex;
      justify-content: center;
      align-items: center;
      background: linear-gradient(135deg, var(--primary-color), var(--secondary-color));
    }

    mat-nav-list {
      padding-top: 20px;
    }

    mat-nav-list a {
      margin: 8px 0;
      border-radius: 0 24px 24px 0;
      margin-right: 16px;
    }

    mat-nav-list a.active {
      background-color: var(--primary-color);
      color: white;
    }

    mat-nav-list a.active mat-icon {
      color: white;
    }

    @media (max-width: 600px) {
      mat-sidenav {
        width: 200px;
      }

      .content-container {
        padding: 16px;
      }
    }
  `]
})
export class AppComponent {
  @ViewChild('sidenav') sidenav!: MatSidenav;

  constructor(public authService: AuthService) {}

  logout(): void {
    this.authService.logout();
  }

  toggleSidenav(): void {
    this.sidenav.toggle();
  }
}
