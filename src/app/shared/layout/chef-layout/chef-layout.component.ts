import { Component } from '@angular/core';

@Component({
  selector: 'app-chef-layout',
  template: `
    <div class="chef-layout-wrapper">
      <!-- Sidebar simplifiée pour chef -->
      <app-sidebar-chef></app-sidebar-chef>

      <div class="chef-main">
        <!-- Topbar simplifiée pour chef -->
        <app-topbar-chef></app-topbar-chef>

        <div class="chef-content">
          <router-outlet></router-outlet>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .chef-layout-wrapper {
      display: flex;
      min-height: 100vh;
      background: #f8f9fa;
    }
    .chef-main {
      flex: 1;
      display: flex;
      flex-direction: column;
      overflow: hidden;
    }
    .chef-content {
      flex: 1;
      padding: 1.5rem;
      overflow-y: auto;
    }
  `]
})
export class ChefLayoutComponent {}