// dashboard.component.ts
import { Component, OnInit } from '@angular/core';
import { MenageService } from '../../core/services/menage.service';
import { ProgrammeService } from '../../core/services/programme.service';
import { AuthService } from '../../core/services/auth.service';
import { Menage, CATEGORIE_LABELS, CATEGORIE_SEVERITY, getChefNom } from '../../core/models/menage.model';
import { Resident, DIPLOMES, TRANCHES_SALARIALES } from '../../core/models/resident.model';
import { Programme } from '../../core/models/programme.model';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {
  // Pour l'agent
  menages: Menage[] = [];
  
  // Pour le chef
  monMenage: Menage | null = null;
  residents: Resident[] = [];
  
  programmes: Programme[] = [];
  loading = true;
  error: string | null = null;
  
  // Rôles
  isAgent = false;
  isChefMenage = false;

  // Stats
  stats = { 
    totalMenages: 0, 
    totalResidents: 0, 
    totalProgrammes: 0, 
    tresVulnerables: 0 
  };
  
  chartData: any;
  chartOptions: any;

  categorieLabels = CATEGORIE_LABELS;
  categorieSeverity = CATEGORIE_SEVERITY;

  // Constantes pour les libellés
  diplomes = DIPLOMES;
  tranchesSalariales = TRANCHES_SALARIALES;

  getChefNom = getChefNom;

  constructor(
    private menageService: MenageService,
    private programmeService: ProgrammeService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    const user = this.authService.getCurrentUser();
    this.isAgent = user?.role === 'AGENT';
    this.isChefMenage = user?.role === 'CHEF_MENAGE';
    
    console.log('Dashboard - Rôle:', this.isAgent ? 'AGENT' : this.isChefMenage ? 'CHEF_MENAGE' : 'AUTRE');
    
    this.loadData();
    this.initChart();
  }

  loadData(): void {
    this.loading = true;
    this.error = null;
    
    // Charger les programmes (commun aux deux rôles)
    this.programmeService.getAll().subscribe({
      next: (data) => { 
        this.programmes = data; 
        this.stats.totalProgrammes = data.length; 
      },
      error: (error) => console.error('Erreur chargement programmes:', error)
    });

    // Charger les données selon le rôle
    if (this.isAgent) {
      this.loadAgentData();
    } else if (this.isChefMenage) {
      this.loadChefData();
    } else {
      this.loading = false;
    }
  }

  private loadAgentData(): void {
    this.menageService.getAll().subscribe({
      next: (data) => {
        this.menages = data;
        this.computeAgentStats();
        this.updateAgentChart();
        this.loading = false;
      },
      error: (error) => {
        console.error('Erreur chargement ménages:', error);
        this.error = 'Erreur lors du chargement des données';
        this.loading = false;
      }
    });
  }

  private loadChefData(): void {
    const user = this.authService.getCurrentUser();
    if (!user?.userId) {
      this.error = 'Informations utilisateur manquantes';
      this.loading = false;
      return;
    }

    console.log('Chargement du ménage du chef:', user.userId);
    
    this.menageService.getMenageByChef(user.userId).subscribe({
      next: (menage) => {
        console.log('Ménage du chef trouvé:', menage);
        this.monMenage = menage;
        
        if (menage.id) {
          this.loadResidents(menage.id);
        } else {
          this.computeChefStats();
          this.updateChefChart();
          this.loading = false;
        }
      },
      error: (error) => {
        console.error('Erreur chargement ménage du chef:', error);
        this.error = 'Votre ménage n\'a pas encore été enregistré. Veuillez contacter un agent.';
        this.loading = false;
      }
    });
  }

  private loadResidents(menageId: string): void {
    this.menageService.getResidents(menageId).subscribe({
      next: (residents) => {
        this.residents = residents;
        this.computeChefStats();
        this.updateChefChart();
        this.loading = false;
      },
      error: (error) => {
        console.error('Erreur chargement résidents:', error);
        this.computeChefStats();
        this.updateChefChart();
        this.loading = false;
      }
    });
  }

  private computeAgentStats(): void {
    this.stats.totalMenages = this.menages.length;
    this.stats.totalResidents = this.menages.reduce((s, m) => s + (m.nombreResidents || 0), 0);
    this.stats.tresVulnerables = this.menages.filter(m => 
      m.categorie === 'TRES_VULNERABLE' || m.categorie === 'VULNERABLE'
    ).length;
  }

  private computeChefStats(): void {
    if (!this.monMenage) return;
    
    this.stats.totalMenages = 1;
    this.stats.totalResidents = this.monMenage.nombreResidents || 0;
    this.stats.tresVulnerables = (this.monMenage.categorie === 'TRES_VULNERABLE' || this.monMenage.categorie === 'VULNERABLE') ? 1 : 0;
  }

  private updateAgentChart(): void {
    if (this.menages.length === 0) {
      this.chartData = null;
      return;
    }

    const counts: Record<string, number> = {};
    for (const m of this.menages) { 
      const categorie = m.categorie || 'NON_DEFINIE';
      counts[categorie] = (counts[categorie] || 0) + 1; 
    }
    
    this.chartData = {
      labels: Object.keys(counts).map(k => this.categorieLabels[k] || k),
      datasets: [{
        data: Object.values(counts),
        backgroundColor: ['#ef5350','#ff9800','#42a5f5','#66bb6a','#26a69a','#ab47bc'],
        borderWidth: 0
      }]
    };
  }

  private updateChefChart(): void {
    if (!this.monMenage) {
      this.chartData = null;
      return;
    }

    this.chartData = {
      labels: ['Résidents', ''],
      datasets: [{
        data: [this.monMenage.nombreResidents || 0, 1],
        backgroundColor: ['#42a5f5', '#e0e0e0'],
        borderWidth: 0
      }]
    };
  }

  initChart(): void {
    this.chartOptions = {
      responsive: true,
      maintainAspectRatio: false,
      plugins: { 
        legend: { 
          position: 'bottom',
          display: this.isAgent
        } 
      }
    };
  }

  get recentMenages(): Menage[] {
    return this.isAgent ? this.menages.slice(0, 5) : [];
  }

  formatLocalisation(menage: Menage): string {
    const parts = [];
    if (menage.region) parts.push(menage.region);
    if (menage.ville) parts.push(menage.ville);
    if (menage.quartier) parts.push(menage.quartier);
    if (menage.adresse) parts.push(menage.adresse);
    return parts.length > 0 ? parts.join(', ') : '';
  }

  getCategorieSeverity(categorie: string | undefined): "success" | "secondary" | "info" | "warning" | "danger" | undefined {
    if (!categorie) return 'secondary';
    const severity = this.categorieSeverity[categorie];
    switch(severity) {
      case 'danger': return 'danger';
      case 'warning': return 'warning';
      case 'info': return 'info';
      case 'success': return 'success';
      default: return 'secondary';
    }
  }

  getCategorieLabel(categorie: string | undefined): string {
    if (!categorie) return 'Non définie';
    return this.categorieLabels[categorie] || categorie;
  }

  // Méthodes pour les résidents
  getResidentNomComplet(resident: Resident): string {
    return `${resident.nom} ${resident.prenom}`.trim();
  }

  getResidentAge(resident: Resident): number | string {
    if (resident.age) return resident.age;
    if (resident.dateNaissance) {
      const today = new Date();
      const birthDate = new Date(resident.dateNaissance);
      let age = today.getFullYear() - birthDate.getFullYear();
      const m = today.getMonth() - birthDate.getMonth();
      if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
        age--;
      }
      return age;
    }
    return '-';
  }

  getDiplomeLabel(diplomeValue: string): string {
    const diplome = this.diplomes.find(d => d.value === diplomeValue);
    return diplome ? diplome.label : diplomeValue;
  }

  getTrancheSalarialeLabel(trancheValue: string): string {
    const tranche = this.tranchesSalariales.find(t => t.value === trancheValue);
    return tranche ? tranche.label : trancheValue;
  }

  formatDate(dateStr: string): string {
    if (!dateStr) return '-';
    const date = new Date(dateStr);
    return date.toLocaleDateString('fr-FR');
  }
}