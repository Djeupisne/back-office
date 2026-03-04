// src/app/core/models/auth.model.ts

export interface LoginRequest {
  email:    string;
  password: string;
}

export interface TwoFaVerifyRequest {
  email: string;
  code:  string;
}

// ✅ Aligné avec AuthResponse.java du backend
export interface AuthResponse {
  userId:            string;
  email:             string;
  fullName:          string;
  role:              string;         // 'AGENT' | 'CHEF_MENAGE' | 'SUPER_ADMIN'
  accessToken:       string;         // ✅ backend renvoie accessToken
  refreshToken:      string;
  requiresTwoFactor: boolean;        // ✅ FIX : nom exact dans AuthResponse.java
  message:           string;
  twoFactorType?:    string;         // optionnel (usage UI uniquement)
  // ❌ SUPPRIMÉ : twoFactorRequired (mauvais nom)
  // ❌ SUPPRIMÉ : tempToken (n'existe pas dans le backend)
}

export interface UserSession {
  userId:       string;
  email:        string;
  fullName:     string;
  role:         string;
  accessToken:  string;
  refreshToken: string;
}

export interface TempAuthData {
  email:          string;
  twoFactorType?: string;
  // ❌ SUPPRIMÉ : tempToken (n'existe pas dans le backend)
}

export interface TokenResponse {
  accessToken:  string;
  refreshToken: string;
  tokenType:    string;
  expiresIn:    number;
}
