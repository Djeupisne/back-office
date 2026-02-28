// src/app/modules/front-office/pages/mon-menage/mon-menage.component.ts
import { Component, OnInit } from '@angular/core';
import { MenageService } from '../../../../core/services/menage.service';
import { AuthService } from '../../../../core/services/auth.service';
import { Menage, Resident } from '../../../../core/models/menage.model';

@Component({
  selector: 'app-mon-menage',
  templateUrl: './mon-menage.component.html',
  styleUrls: ['./mon-menage.component.css']
})
export class MonMenageComponent implements OnInit {
  menage: Menage | null = null;
  residents: Resident[] = [];
  loading = true;
  loadingResidents = false;
  activeTab: 'info' | 'residents' = 'info';

  // Labels des catégories pour l'affichage
  categorieLabels: Record<string, string> = {
    'TRES_VULNERABLE': 'Très vulnérable',
    'VULNERABLE': 'Vulnérable',
    'MOYEN': 'Moyen',
    'AISE': 'Aisé',
    'TRES_RICHE': 'Très riche'
  };

  // Severités pour les tags PrimeNG
  categorieSeverity: Record<string, string> = {
    'TRES_VULNERABLE': 'danger',
    'VULNERABLE': 'warning',
    'MOYEN': 'info',
    'AISE': 'success',
    'TRES_RICHE': 'success'
  };

  constructor(
    private menageService: MenageService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.loadMonMenage();
  }

  loadMonMenage(): void {
    this.loading = true;
    const currentUser = this.authService.getCurrentUser();

    if (currentUser?.userId) {
      this.menageService.getMenageByChef(currentUser.userId).subscribe({
        next: (data) => {
          this.menage = data;
          this.loadResidents();
          this.loading = false;
        },
        error: (err) => {
          console.error('Erreur chargement ménage', err);
          this.menage = null;
          this.loading = false;
        }
      });
    } else {
      console.warn('Aucun utilisateur connecté');
      this.loading = false;
    }
  }

  loadResidents(): void {
    if (this.menage?.id) {
      this.loadingResidents = true;
      this.menageService.getResidents(this.menage.id).subscribe({
        next: (data) => {
          this.residents = data;
          this.loadingResidents = false;
        },
        error: (err) => {
          console.error('Erreur chargement résidents', err);
          this.residents = [];
          this.loadingResidents = false;
        }
      });
    }
  }

  onTabChange(event: any): void {
    this.activeTab = event.index === 0 ? 'info' : 'residents';
    if (this.activeTab === 'residents' && this.residents.length === 0) {
      this.loadResidents();
    }
  }

  getCategorieLabel(categorie: string): string {
    return this.categorieLabels[categorie] || categorie || 'Non définie';
  }

  getCategorieSeverity(categorie: string): string {
    return this.categorieSeverity[categorie] || 'info';
  }

  getScorePercentage(score: number): number {
    if (!score) return 0;
    const maxScore = 140;
    return Math.min(Math.round((score / maxScore) * 100), 100);
  }

  getAge(dateNaissance: string | Date): number | null {
    if (!dateNaissance) return null;

    const today = new Date();
    const birthDate = new Date(dateNaissance);
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();

    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }

    return age;
  }

  get chefResident(): Resident | null {
    return this.residents.find(r => r.estChef) || null;
  }
}