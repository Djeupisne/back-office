import { Component } from '@angular/core';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss']
})
export class SidebarComponent {

  constructor(public authService: AuthService) {}

  // ── Rôles ─────────────────────────────────────
  get isAgent(): boolean {
    return this.authService.getRole() === 'AGENT';
  }

  get isChef(): boolean {
    return this.authService.getRole() === 'CHEF_MENAGE';
  }

  // ── Infos utilisateur ─────────────────────────
  get userName(): string {
    const user = this.authService.getCurrentUser(); // ✅ méthode existante dans AuthService
    if (!user) return '';
    return user.fullName || user.email || '';
  }

  get userInitial(): string {
    return this.userName.charAt(0).toUpperCase() || '?';
  }

  get userRole(): string {
    if (this.isAgent) return 'Agent recenseur';
    if (this.isChef)  return 'Chef de ménage';
    return '';
  }
}