// core/guards/role.guard.ts
import { Injectable } from '@angular/core';
import { CanActivate, Router, ActivatedRouteSnapshot } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Injectable({ providedIn: 'root' })
export class RoleGuard implements CanActivate {

  constructor(private authService: AuthService, private router: Router) {}

  canActivate(route: ActivatedRouteSnapshot): boolean {
    // Accepter soit 'role' (singulier) soit 'roles' (pluriel)
    const requiredRole = route.data['role'];
    const requiredRoles = route.data['roles'] as string[];

    const userRole = this.authService.getRole();

    // Si aucun rôle requis, accès autorisé
    if (!requiredRole && (!requiredRoles || requiredRoles.length === 0)) {
      return true;
    }

    // Vérifier le rôle singulier
    if (requiredRole && userRole === requiredRole) {
      return true;
    }

    // Vérifier le tableau de rôles
    if (requiredRoles && requiredRoles.length > 0 && userRole && requiredRoles.includes(userRole)) {
      return true;
    }

    // Rediriger selon le rôle
    if (userRole === 'AGENT') {
      this.router.navigate(['/dashboard']);
    } else if (userRole === 'CHEF_MENAGE') {
      this.router.navigate(['/dashboard']); // Rediriger vers dashboard au lieu de mon-menage
    } else {
      this.router.navigate(['/auth/login']);
    }

    return false;
  }
}