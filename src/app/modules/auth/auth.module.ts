import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SharedModule } from '../../shared/shared.module';
import { LoginComponent } from './login/login.component';
import { VerifyOtpComponent } from './verify-otp/verify-otp.component';

const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: 'verify-otp', component: VerifyOtpComponent },
  { path: '', redirectTo: 'login', pathMatch: 'full' }
];

@NgModule({
  declarations: [LoginComponent, VerifyOtpComponent],
  imports: [SharedModule, RouterModule.forChild(routes)]
})
export class AuthModule {}
