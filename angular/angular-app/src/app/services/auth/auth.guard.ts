import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router } from '@angular/router';

import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root',
})
export class AuthGuard implements CanActivate {
  constructor(private authService: AuthService, private router: Router) {
  }

  canActivate(next: ActivatedRouteSnapshot): boolean {
    // with real data you don't need it
    if (localStorage.getItem('currentUser')) {
      return true;
    }
    // Check if user is looged in
    // if (this.authService.isLoggedIn) {
    //   return true;
    // }
    // Navigate to the login page with extras
    this.router.navigate(['/login']);
    return false;
  }

}
