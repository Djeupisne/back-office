export interface LoginRequest {
  email: string;
  password: string;
}

export interface TwoFaVerifyRequest {
  email: string;
  code: string;
  tempToken: string;
}

export interface AuthResponse {
  userId?: string;
  email: string;
  fullName?: string;
  role?: string;
  accessToken?: string;
  refreshToken?: string;
  twoFactorRequired: boolean;
  twoFactorType?: string;
  tempToken?: string;
  message?: string;
  canSetupTotp?: boolean;
}

export interface UserSession {
  userId: string;
  email: string;
  fullName: string;
  role: string;
  accessToken: string;
  refreshToken: string;
}

export interface TempAuthData {
  email: string;
  tempToken: string;
  twoFactorType: string;
}
