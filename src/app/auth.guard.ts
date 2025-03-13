import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  constructor(private router: Router) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): boolean {
    const isLoggedIn = this.checkLogin(); 

    if (!isLoggedIn) {
      this.router.navigate(['/login']); 
      return false;
    }
    return true;
  }

  checkLogin(): boolean {
    
    return !!localStorage.getItem('token'); 
  }
} 