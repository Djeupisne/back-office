import { Component } from '@angular/core';
import { AuthService } from '../../../core/services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-sidebar-chef',
  templateUrl: './sidebar-chef.component.html',
  styleUrls: ['./sidebar-chef.component.scss']
})
export class SidebarChefComponent {

  constructor(
    public authService: AuthService,
    private router: Router
  ) {}

  get userName(): string {
    const user = this.authService.getCurrentUser();
    return user?.fullName || user?.email || 'Chef';
  }

  get userInitial(): string {
    return this.userName.charAt(0).toUpperCase() || 'C';
  }

  logout(): void {
    this.authService.logout();
  }
}