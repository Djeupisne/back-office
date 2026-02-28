// src/app/shared/layout/topbar-chef/topbar-chef.component.ts
import { Component } from '@angular/core';

@Component({
  selector: 'app-topbar-chef',
  template: `
    <header class="topbar-chef">
      <div class="topbar-chef-title">
        <i class="pi pi-home"></i>
        <span>Mon espace familial</span>
      </div>
      <div class="topbar-chef-date">
        <i class="pi pi-calendar"></i>
        {{ currentDate | date:'dd MMMM yyyy' }}
      </div>
    </header>
  `,
  styles: [`
    .topbar-chef {
      height: 60px;
      background: white;
      border-bottom: 1px solid #f0f0f0;
      padding: 0 1.5rem;
      display: flex;
      align-items: center;
      justify-content: space-between;
      position: sticky;
      top: 0;
      z-index: 100;
    }

    .topbar-chef-title {
      display: flex;
      align-items: center;
      gap: 0.75rem;
      font-size: 1.1rem;
      font-weight: 500;
      color: #333;
    }

    .topbar-chef-title i {
      color: #4CAF50;
      font-size: 1.2rem;
    }

    .topbar-chef-date {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      color: #666;
      font-size: 0.9rem;
    }

    .topbar-chef-date i {
      color: #4CAF50;
    }
  `]
})
export class TopbarChefComponent {
  currentDate = new Date();
}