import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from './core/guards/auth.guard';
import { RoleGuard } from './core/guards/role.guard';

const routes: Routes = [
  { path: '', redirectTo: '/dashboard', pathMatch: 'full' },

  // ✅ Routes sans layout (page de login, etc.)
  {
    path: 'auth',
    loadChildren: () => import('./modules/auth/auth.module').then(m => m.AuthModule)
  },

  // ✅ Routes AVEC layout (toutes les pages protégées)
  {
    path: '',
    loadChildren: () => import('./shared/layout/layout.module').then(m => m.LayoutModule),
    canActivate: [AuthGuard]  // Protection au niveau du layout
  },

  { path: '**', redirectTo: '/dashboard' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }