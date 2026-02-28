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
  twoFactorType = 'EMAIL_OTP';

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private msg: MessageService
  ) {
    this.form = this.fb.group({ code: ['', [Validators.required, Validators.minLength(6), Validators.maxLength(6)]] });
  }

  ngOnInit(): void {
    const raw = localStorage.getItem('tempAuth');
    if (!raw) { this.router.navigate(['/auth/login']); return; }
    const data = JSON.parse(raw);
    this.email = data.email;
    this.twoFactorType = data.twoFactorType || 'EMAIL_OTP';
  }

  submit(): void {
    if (this.form.invalid) return;
    this.loading = true;
    const { email, tempToken } = JSON.parse(localStorage.getItem('tempAuth')!);
    this.authService.verifyOtp({ email, tempToken, code: this.form.value.code }).subscribe({
      next: () => {
        this.loading = false;
        localStorage.removeItem('tempAuth');
        this.router.navigate(['/dashboard']);
      },
      error: (err) => {
        this.loading = false;
        this.msg.add({ severity: 'error', summary: 'Erreur', detail: err.error?.error || 'Code incorrect ou expiré' });
      }
    });
  }
}
