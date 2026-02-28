// layout.module.ts
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LayoutComponent } from './layout.component';
import { SidebarComponent } from './sidebar/sidebar.component';
import { TopbarComponent } from './topbar/topbar.component';
import { SharedModule } from '../shared.module';
import { RoleGuard } from '../../core/guards/role.guard';

const routes: Routes = [
  {
    path: '',
    component: LayoutComponent,
    children: [
      // Dashboard accessible à tous (agent ET chef)
      { 
        path: 'dashboard', 
        loadChildren: () => import('../../modules/dashboard/dashboard.module').then(m => m.DashboardModule) 
      },
      
      // Route pour le chef (redirigée vers dashboard)
      { 
        path: 'mon-menage', 
        redirectTo: '/dashboard', 
        pathMatch: 'full' 
      },
      
      // Routes réservées aux agents
      { 
        path: 'menages', 
        loadChildren: () => import('../../modules/menages/menages.module').then(m => m.MenagesModule),
        canActivate: [RoleGuard],
        data: { role: 'AGENT' } // Utiliser 'role' au lieu de 'roles'
      },
      { 
        path: 'residents', 
        loadChildren: () => import('../../modules/residents/residents.module').then(m => m.ResidentsModule),
        canActivate: [RoleGuard],
        data: { role: 'AGENT' } // Utiliser 'role' au lieu de 'roles'
      },
      { 
        path: 'programmes', 
        loadChildren: () => import('../../modules/programmes/programmes.module').then(m => m.ProgrammesModule),
        canActivate: [RoleGuard],
        data: { role: 'AGENT' } // Utiliser 'role' au lieu de 'roles'
      }
    ]
  }
];

@NgModule({
  declarations: [LayoutComponent, SidebarComponent, TopbarComponent],
  imports: [SharedModule, RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class LayoutModule {}