import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class AutoLogoutService {
  private timeout: any;

  constructor(private authService: AuthService, private router: Router) {
    this.startTimer();
    this.setupActivityListeners();
  }

  private startTimer() {
    this.timeout = setTimeout(() => {
      this.authService.logout();
      this.router.navigate(['/login']);
    }, 5 * 60 * 1000); // 5 minutos
  }

  private resetTimer() {
    clearTimeout(this.timeout);
    this.startTimer();
  }

  private setupActivityListeners() {
    window.addEventListener('mousemove', () => this.resetTimer());
    window.addEventListener('keydown', () => this.resetTimer());
  }
}
