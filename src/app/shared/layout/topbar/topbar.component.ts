import { Component, OnInit } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';
import { AuthService } from '../../../core/services/auth.service';
import { UserSession } from '../../../core/models/auth.model';

@Component({
  selector: 'app-topbar',
  templateUrl: './topbar.component.html',
  styleUrls: ['./topbar.component.scss']
})
export class TopbarComponent implements OnInit {
  currentUser: UserSession | null = null;
  pageTitle = 'Tableau de bord';

  private routeTitles: Record<string, string> = {
    '/dashboard': 'Tableau de bord',
    '/menages': 'Ménages',
    '/menages/nouveau': 'Nouveau Ménage',
    '/residents': 'Résidents',
    '/residents/nouveau': 'Nouveau Résident',
    '/programmes': 'Programmes Sociaux',
    '/programmes/nouveau': 'Nouveau Programme'
  };

  constructor(private authService: AuthService, private router: Router) {}

  ngOnInit(): void {
    this.authService.currentUser$.subscribe(user => this.currentUser = user);
    this.router.events.pipe(filter(e => e instanceof NavigationEnd)).subscribe((e: any) => {
      const key = Object.keys(this.routeTitles).find(r => e.url.startsWith(r)) || '/dashboard';
      this.pageTitle = this.routeTitles[key];
    });
  }
}
