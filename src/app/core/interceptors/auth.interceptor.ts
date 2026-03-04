// src/app/core/interceptors/auth.interceptor.ts
import { Injectable } from '@angular/core';
import {
  HttpInterceptor, HttpRequest, HttpHandler,
  HttpEvent, HttpErrorResponse
} from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { AuthService } from '../services/auth.service';
import { Router } from '@angular/router';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {

  constructor(private authService: AuthService, private router: Router) {}

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const token   = this.authService.getToken();
    const userId  = this.authService.getCurrentUser()?.userId || '';

    if (token) {
      req = req.clone({
        setHeaders: {
          Authorization: `Bearer ${token}`,
          // ✅ X-User-Id requis par MenageController et ProgrammeSocialController
          'X-User-Id': userId
        }
      });
    }

    return next.handle(req).pipe(
      catchError((error: HttpErrorResponse) => {
        if (error.status === 401) {
          console.warn('Token expiré — déconnexion');
          this.authService.logout();
        }
        if (error.status === 403) {
          console.warn('Accès refusé — rôle insuffisant');
          this.router.navigate(['/auth/login']);
        }
        return throwError(() => error);
      })
    );
  }
}
