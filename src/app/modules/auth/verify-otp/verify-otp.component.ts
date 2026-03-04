// src/app/modules/auth/verify-otp/verify-otp.component.ts
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-verify-otp',
  templateUrl: './verify-otp.component.html',
  styleUrls: ['./verify-otp.component.scss']
})
export class VerifyOtpComponent implements OnInit {
  form: FormGroup;
  loading = false;
  email = '';
  // CONSERVE: twoFactorType utilise dans le template HTML pour afficher le bon message
  twoFactorType = 'EMAIL_OTP';

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private msg: MessageService
  ) {
    this.form = this.fb.group({
      code: ['', [Validators.required, Validators.minLength(6), Validators.maxLength(6)]]
    });
  }

  ngOnInit(): void {
    const raw = localStorage.getItem('tempAuth');
    if (!raw) { this.router.navigate(['/auth/login']); return; }
    const data = JSON.parse(raw);
    this.email         = data.email;
    this.twoFactorType = data.twoFactorType || 'EMAIL_OTP';
  }

  submit(): void {
    if (this.form.invalid) return;
    this.loading = true;

    const data = JSON.parse(localStorage.getItem('tempAuth')!);
    const email = data.email;

    // FIX: verifyOtp n'accepte que { email, code }
    // tempToken supprime — le backend identifie l'utilisateur par email uniquement
    this.authService.verifyOtp({
      email: email,
      code:  this.form.value.code
    }).subscribe({
      next: () => {
        this.loading = false;
        localStorage.removeItem('tempAuth');
        // Navigation geree par handleAuthResponse() dans auth.service.ts
      },
      error: (err) => {
        this.loading = false;
        this.msg.add({
          severity: 'error',
          summary:  'Erreur',
          detail:   err.error?.error || 'Code incorrect ou expiré'
        });
      }
    });
  }
}
