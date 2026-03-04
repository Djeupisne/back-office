// src/app/core/guards/role.guard.ts
// FICHIER MANQUANT - reference dans app-routing.module.ts
import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Injectable({ providedIn: 'root' })
export class RoleGuard implements CanActivate {
  constructor(private auth: AuthService, private router: Router) {}

  canActivate(route: ActivatedRouteSnapshot): boolean {
    const expectedRoles: string[] = route.data['roles'] ?? [];
    const userRole = this.auth.getRole();
    if (userRole && (expectedRoles.length === 0 || expectedRoles.includes(userRole))) {
      return true;
    }
    this.router.navigate(['/auth/login']);
    return false;
  }
}

// USAGE dans app-routing.module.ts:
// { path: 'agent', canActivate: [AuthGuard, RoleGuard], data: { roles: ['AGENT'] }, ... }
// { path: 'chef', canActivate: [AuthGuard, RoleGuard], data: { roles: ['CHEF_MENAGE'] }, ... }
