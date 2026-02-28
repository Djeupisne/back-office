// src/app/core/services/auth.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { AuthResponse, LoginRequest, TwoFaVerifyRequest, UserSession, TempAuthData } from '../models/auth.model';

@Injectable({ providedIn: 'root' })
export class AuthService {

  private readonly AUTH_URL = '/api/v1/auth';
  private readonly USER_KEY = 'user';
  private readonly TEMP_KEY = 'tempAuth';

  private currentUserSubject = new BehaviorSubject<UserSession | null>(this.getStoredUser());
  currentUser$ = this.currentUserSubject.asObservable();

  constructor(private http: HttpClient, private router: Router) {}

  /**
   * Connexion utilisateur
   */
  login(request: LoginRequest): Observable<AuthResponse> {
    console.log('🔑 Tentative de login:', request.email);

    return this.http.post<AuthResponse>(`${this.AUTH_URL}/login`, request).pipe(
      tap({
        next: (response) => {
          console.log('📦 Réponse login:', response);

          if (response.twoFactorRequired) {
            // Stocker les données temporaires pour la 2FA
            if (response.email && response.tempToken) {
              const tempData: TempAuthData = {
                email: response.email,
                tempToken: response.tempToken,
                twoFactorType: response.twoFactorType || 'APP'
              };
              localStorage.setItem(this.TEMP_KEY, JSON.stringify(tempData));
              this.router.navigate(['/auth/2fa-verify']);
            }
          } else {
            // Connexion directe sans 2FA
            this.handleAuthResponse(response);
          }
        },
        error: (error) => {
          console.error('❌ Erreur login:', error);
          // Réinitialiser en cas d'erreur
          this.clearTempData();
        }
      })
    );
  }

  /**
   * Vérification du code 2FA
   */
  verifyOtp(request: TwoFaVerifyRequest): Observable<AuthResponse> {
    console.log('🔐 Vérification 2FA pour:', request.email);

    return this.http.post<AuthResponse>(`${this.AUTH_URL}/2fa/verify`, request).pipe(
      tap({
        next: (response) => {
          console.log('✅ Réponse 2FA:', response);
          this.handleAuthResponse(response);
        },
        error: (error) => {
          console.error('❌ Erreur 2FA:', error);
        }
      })
    );
  }

  /**
   * Traite la réponse d'authentification et crée la session
   */
  private handleAuthResponse(response: AuthResponse): void {
    // Vérifier que les données nécessaires sont présentes
    if (!response.userId || !response.accessToken) {
      console.error('Réponse d\'authentification invalide - données manquantes', response);
      this.clearTempData();
      return;
    }

    // Créer la session utilisateur
    const session: UserSession = {
      userId: response.userId,
      email: response.email,
      fullName: response.fullName || '',
      role: response.role || 'USER',
      accessToken: response.accessToken,
      refreshToken: response.refreshToken || ''
    };

    // Sauvegarder et mettre à jour
    localStorage.setItem(this.USER_KEY, JSON.stringify(session));
    this.clearTempData();
    this.currentUserSubject.next(session);

    // 🔥 REDIRECTION SELON LE RÔLE 🔥
    if (session.role === 'AGENT') {
      console.log('👤 Agent connecté, redirection vers /agent/dashboard');
      this.router.navigate(['/agent/dashboard']);
    } else if (session.role === 'CHEF_MENAGE') {
      console.log('🏠 Chef de ménage connecté, redirection vers /chef/mon-menage');
      this.router.navigate(['/chef/mon-menage']);
    } else {
      console.warn('⚠️ Rôle inconnu, redirection par défaut');
      this.router.navigate(['/dashboard']);
    }
  }

  /**
   * Récupère les données temporaires pour la 2FA
   */
  getTempAuthData(): TempAuthData | null {
    try {
      const data = localStorage.getItem(this.TEMP_KEY);
      return data ? JSON.parse(data) : null;
    } catch {
      return null;
    }
  }

  /**
   * Efface les données temporaires
   */
  private clearTempData(): void {
    localStorage.removeItem(this.TEMP_KEY);
  }

  /**
   * Déconnexion
   */
  logout(): void {
    console.log('🚪 Déconnexion');
    localStorage.removeItem(this.USER_KEY);
    this.clearTempData();
    this.currentUserSubject.next(null);
    this.router.navigate(['/auth/login']);
  }

  /**
   * Récupère le token d'accès
   */
  getToken(): string | null {
    return this.getStoredUser()?.accessToken ?? null;
  }

  /**
   * Vérifie si l'utilisateur est authentifié
   */
  isAuthenticated(): boolean {
    return !!this.getStoredUser();
  }

  /**
   * Récupère le rôle de l'utilisateur
   */
  getRole(): string | null {
    return this.getStoredUser()?.role ?? null;
  }

  /**
   * Récupère l'utilisateur courant
   */
  getCurrentUser(): UserSession | null {
    return this.currentUserSubject.value;
  }

  /**
   * Récupère l'utilisateur stocké dans localStorage
   */
  private getStoredUser(): UserSession | null {
    try {
      const stored = localStorage.getItem(this.USER_KEY);
      if (!stored) return null;

      const user = JSON.parse(stored) as UserSession;

      // Vérifier que l'objet a la structure attendue
      if (user && user.userId && user.accessToken) {
        return user;
      }

      // Données invalides, on nettoie
      localStorage.removeItem(this.USER_KEY);
      return null;
    } catch {
      localStorage.removeItem(this.USER_KEY);
      return null;
    }
  }
}