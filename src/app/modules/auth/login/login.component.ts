// src/app/modules/auth/login/login.component.ts
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {
  form: FormGroup;
  loading = false;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private msg: MessageService
  ) {
    this.form = this.fb.group({
      email:    ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });
    if (this.authService.isAuthenticated()) this.router.navigate(['/dashboard']);
  }

  submit(): void {
    if (this.form.invalid) { this.form.markAllAsTouched(); return; }
    this.loading = true;

    this.authService.login(this.form.value).subscribe({
      next: (res) => {
        this.loading = false;
        // FIX: requiresTwoFactor (backend AuthResponse.java) — plus twoFactorRequired
        if (res.requiresTwoFactor) {
          localStorage.setItem('tempAuth', JSON.stringify({
            email:         res.email,
            // FIX: tempToken supprime (n'existe pas dans AuthResponse backend)
            // Le backend envoie le code 2FA par email directement
            twoFactorType: 'EMAIL_OTP'
          }));
          this.router.navigate(['/auth/verify-otp']);
        }
        // Sinon: navigation geree par handleAuthResponse() dans auth.service.ts
      },
      error: (err) => {
        this.loading = false;
        this.msg.add({
          severity: 'error',
          summary:  'Erreur',
          detail:   err.error?.message || 'Identifiants incorrects'
        });
      }
    });
  }

  // Getters pour les validations dans le template HTML
  get email()    { return this.form.get('email'); }
  get password() { return this.form.get('password'); }
}
