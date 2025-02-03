import { inject, Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, CanActivateFn, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService } from '../services/auth.service';

export const authGuard: CanActivateFn = (route: ActivatedRouteSnapshot, state: RouterStateSnapshot) => {
  const authService = inject(AuthService);
  const router = inject(Router);
  const isLoggedIn = authService.isAuthenticated();
  const isAdmin = authService.isAdmin();  

  if (isLoggedIn) {
    if (isAdmin && state.url === '/admin') {
      return true; 
    }
    if (isAdmin && state.url !== '/admin') {
      router.navigate(['/admin']);  
      return false;
    }
    return true; 
  } else {
    authService.redirectUrl = state.url;
    router.navigate(['/auth/login']);
    return false;
  }
};
