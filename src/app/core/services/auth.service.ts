// src/app/core/services/auth.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { AuthResponse, LoginRequest, TwoFaVerifyRequest, UserSession, TempAuthData } from '../models/auth.model';
import { environment } from '../../../environments/environment';

@Injectable({ providedIn: 'root' })
export class AuthService {

  private readonly AUTH_URL = environment.authUrl + '/api/v1/auth';
  
  private readonly USER_KEY = 'user';
  private readonly TEMP_KEY = 'tempAuth';

  private currentUserSubject = new BehaviorSubject<UserSession | null>(this.getStoredUser());
  currentUser$ = this.currentUserSubject.asObservable();

  constructor(private http: HttpClient, private router: Router) {}

  login(request: LoginRequest): Observable<AuthResponse> {
    console.log('🔑 Tentative de login:', request.email);
    
    return this.http.post<AuthResponse>(`${this.AUTH_URL}/login`, request).pipe(
      tap({
        next: (response) => {
          console.log('📦 Réponse login reçue:', response);
          
          if (response.requiresTwoFactor) {
            if (response.email) {
              const tempData: TempAuthData = {
                email: response.email,
                twoFactorType: 'EMAIL'
              };
              localStorage.setItem(this.TEMP_KEY, JSON.stringify(tempData));
              this.router.navigate(['/auth/2fa-verify']);
            }
          } else {
            this.handleAuthResponse(response);
          }
        },
        error: (error) => {
          console.error('❌ Erreur login détaillée:', {
            status: error.status,
            message: error.message,
            url: error.url,
            error: error.error
          });
          this.clearTempData();
        }
      })
    );
  }

  verifyOtp(request: TwoFaVerifyRequest): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.AUTH_URL}/2fa/verify`, request).pipe(
      tap({ 
        next: (response) => this.handleAuthResponse(response),
        error: (error) => console.error('Erreur vérification 2FA:', error)
      })
    );
  }

  private handleAuthResponse(response: AuthResponse): void {
    if (!response.userId || !response.accessToken) {
      console.error('❌ Réponse invalide - userId ou accessToken manquant', response);
      this.clearTempData();
      return;
    }

    const session: UserSession = {
      userId: response.userId,
      email: response.email || '',
      fullName: response.fullName || '',
      role: response.role ? String(response.role) : 'USER',
      accessToken: response.accessToken,
      refreshToken: response.refreshToken || ''
    };

    localStorage.setItem(this.USER_KEY, JSON.stringify(session));
    this.clearTempData();
    this.currentUserSubject.next(session);

    console.log('✅ Connexion réussie pour:', session.email, 'Rôle:', session.role);
    
    if (session.role === 'AGENT') {
      this.router.navigate(['/agent/dashboard']);
    } else if (session.role === 'CHEF_MENAGE') {
      this.router.navigate(['/chef/mon-menage']);
    } else {
      this.router.navigate(['/dashboard']);
    }
  }

  getTempAuthData(): TempAuthData | null {
    try { 
      const data = localStorage.getItem(this.TEMP_KEY); 
      return data ? JSON.parse(data) : null; 
    } catch {
      console.error('Erreur parsing tempAuth data');
      return null; 
    }
  }

  private clearTempData(): void { 
    localStorage.removeItem(this.TEMP_KEY); 
  }

  logout(): void {
    console.log('🚪 Déconnexion utilisateur');
    localStorage.removeItem(this.USER_KEY);
    this.clearTempData();
    this.currentUserSubject.next(null);
    this.router.navigate(['/auth/login']);
  }

  getToken(): string | null { 
    return this.getStoredUser()?.accessToken ?? null; 
  }

  isAuthenticated(): boolean { 
    return !!this.getStoredUser(); 
  }

  getRole(): string | null { 
    return this.getStoredUser()?.role ?? null; 
  }

  getCurrentUser(): UserSession | null { 
    return this.currentUserSubject.value; 
  }

  private getStoredUser(): UserSession | null {
    try {
      const stored = localStorage.getItem(this.USER_KEY);
      if (!stored) return null;
      
      const user = JSON.parse(stored) as UserSession;
      
      if (user?.userId && user?.accessToken) {
        return user;
      }
      
      console.warn('Données utilisateur invalides détectées, nettoyage...');
      localStorage.removeItem(this.USER_KEY);
      return null;
    } catch (error) {
      console.error('Erreur parsing stored user:', error);
      localStorage.removeItem(this.USER_KEY);
      return null;
    }
  }
}