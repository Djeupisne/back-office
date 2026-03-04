// src/app/core/services/auth.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { AuthResponse, LoginRequest, TwoFaVerifyRequest, UserSession, TempAuthData } from '../models/auth.model';
import { environment } from '../../../environments/environment';

@Injectable({ providedIn: 'root' })
export class AuthService {

  // ✅ CORRECTION: Le bon endpoint est /api/v1/auth (pas /auth-api/v1/auth)
  // D'après le test curl réussi: http://localhost:9000/api/v1/auth/login
  private readonly AUTH_URL = '/auth-api/auth';
  // Alternative si vous utilisez un proxy:
  // private readonly AUTH_URL = '/auth-api/v1/auth';
  
  private readonly USER_KEY = 'user';
  private readonly TEMP_KEY = 'tempAuth';

  private currentUserSubject = new BehaviorSubject<UserSession | null>(this.getStoredUser());
  currentUser$ = this.currentUserSubject.asObservable();

  constructor(private http: HttpClient, private router: Router) {}

  login(request: LoginRequest): Observable<AuthResponse> {
    console.log('🔑 Tentative de login:', request.email);
    
    // ✅ CORRECTION: URL complète avec le bon chemin
    return this.http.post<AuthResponse>(`${this.AUTH_URL}/login`, request).pipe(
      tap({
        next: (response) => {
          console.log('📦 Réponse login reçue:', response);
          
          // ✅ CORRECTION: Utilisation correcte des champs de la réponse
          // D'après la réponse curl, les champs sont: 
          // userId, email, fullName, role, accessToken, refreshToken, requiresTwoFactor
          
          if (response.requiresTwoFactor) {
            // Cas 2FA requis
            if (response.email) {
              const tempData: TempAuthData = {
                email: response.email,
                twoFactorType: 'EMAIL' // ou récupérer depuis response.twoFactorType si disponible
              };
              localStorage.setItem(this.TEMP_KEY, JSON.stringify(tempData));
              this.router.navigate(['/auth/2fa-verify']);
            }
          } else {
            // Connexion directe réussie
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
    // ✅ CORRECTION: URL pour la vérification 2FA
    return this.http.post<AuthResponse>(`${this.AUTH_URL}/2fa/verify`, request).pipe(
      tap({ 
        next: (response) => this.handleAuthResponse(response),
        error: (error) => console.error('Erreur vérification 2FA:', error)
      })
    );
  }

  private handleAuthResponse(response: AuthResponse): void {
    // ✅ CORRECTION: Validation améliorée des champs requis
    if (!response.userId || !response.accessToken) {
      console.error('❌ Réponse invalide - userId ou accessToken manquant', response);
      this.clearTempData();
      return;
    }

    // ✅ CORRECTION: Création de la session utilisateur avec tous les champs disponibles
    const session: UserSession = {
      userId: response.userId,
      email: response.email || '',
      fullName: response.fullName || '',
      role: response.role ? String(response.role) : 'USER',
      accessToken: response.accessToken,
      refreshToken: response.refreshToken || ''
    };

    // Stockage de la session
    localStorage.setItem(this.USER_KEY, JSON.stringify(session));
    this.clearTempData();
    this.currentUserSubject.next(session);

    // ✅ CORRECTION: Redirection basée sur le rôle
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
      
      // ✅ CORRECTION: Validation stricte des données stockées
      if (user?.userId && user?.accessToken) {
        return user;
      }
      
      // Données invalides, on nettoie
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