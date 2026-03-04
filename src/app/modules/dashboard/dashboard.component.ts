// src/app/modules/dashboard/dashboard.component.ts
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
  menages:    Menage[]    = [];
  monMenage:  Menage | null = null;
  residents:  Resident[]  = [];
  programmes: Programme[] = [];
  loading = true;
  error: string | null = null;

  isAgent      = false;
  isChefMenage = false;

  stats = { totalMenages: 0, totalResidents: 0, totalProgrammes: 0, tresVulnerables: 0 };

  chartData:    any;
  chartOptions: any;

  categorieLabels   = CATEGORIE_LABELS;
  categorieSeverity = CATEGORIE_SEVERITY;
  diplomes          = DIPLOMES;
  tranchesSalariales = TRANCHES_SALARIALES;
  getChefNom = getChefNom;

  constructor(
    private menageService:   MenageService,
    private programmeService: ProgrammeService,
    private authService:     AuthService
  ) {}

  ngOnInit(): void {
    const user    = this.authService.getCurrentUser();
    this.isAgent      = user?.role === 'AGENT';
    this.isChefMenage = user?.role === 'CHEF_MENAGE';
    this.loadData();
    this.initChart();
  }

  loadData(): void {
    this.loading = true;
    this.error   = null;

    this.programmeService.getAll().subscribe({
      next:  (data) => { this.programmes = data; this.stats.totalProgrammes = data.length; },
      error: (err)  => console.error('Erreur programmes:', err)
    });

    if (this.isAgent)           this.loadAgentData();
    else if (this.isChefMenage) this.loadChefData();
    else                        this.loading = false;
  }

  private loadAgentData(): void {
    this.menageService.getAll().subscribe({
      next: (data) => {
        this.menages = data;
        this.computeAgentStats();
        this.updateAgentChart();
        this.loading = false;
      },
      error: (err) => {
        console.error('Erreur menages:', err);
        this.error   = 'Erreur lors du chargement des données';
        this.loading = false;
      }
    });
  }

  private loadChefData(): void {
    const user = this.authService.getCurrentUser();
    if (!user?.userId) {
      this.error   = 'Informations utilisateur manquantes';
      this.loading = false;
      return;
    }

    // FIX: getMenageByChef n'existe pas cote backend (/by-chef/{id} inexistant)
    // On utilise getById(userId) — le userId du chef correspond a son menageId
    // dans la session stockee par auth.service lors du login
    this.menageService.getById(user.userId).subscribe({
      next: (menage) => {
        this.monMenage = menage;
        if (menage.id) {
          this.loadResidents(menage.id);
        } else {
          this.computeChefStats();
          this.updateChefChart();
          this.loading = false;
        }
      },
      error: (err) => {
        console.error('Erreur menage chef:', err);
        this.error   = 'Votre ménage n\'a pas encore été enregistré. Veuillez contacter un agent.';
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
      error: (err) => {
        console.error('Erreur residents:', err);
        this.computeChefStats();
        this.updateChefChart();
        this.loading = false;
      }
    });
  }

  private computeAgentStats(): void {
    this.stats.totalMenages   = this.menages.length;
    this.stats.totalResidents = this.menages.reduce((s, m) => s + (m.nombreResidents || 0), 0);
    this.stats.tresVulnerables = this.menages.filter(m =>
      m.categorie === 'TRES_VULNERABLE' || m.categorie === 'VULNERABLE'
    ).length;
  }

  private computeChefStats(): void {
    if (!this.monMenage) return;
    this.stats.totalMenages   = 1;
    this.stats.totalResidents = this.monMenage.nombreResidents || 0;
    this.stats.tresVulnerables = (
      this.monMenage.categorie === 'TRES_VULNERABLE' ||
      this.monMenage.categorie === 'VULNERABLE'
    ) ? 1 : 0;
  }

  private updateAgentChart(): void {
    if (!this.menages.length) { this.chartData = null; return; }
    const counts: Record<string, number> = {};
    for (const m of this.menages) {
      const c = m.categorie || 'NON_DEFINIE';
      counts[c] = (counts[c] || 0) + 1;
    }
    this.chartData = {
      labels: Object.keys(counts).map(k => this.categorieLabels[k] || k),
      datasets: [{ data: Object.values(counts), backgroundColor: ['#ef5350','#ff9800','#42a5f5','#66bb6a','#26a69a','#ab47bc'], borderWidth: 0 }]
    };
  }

  private updateChefChart(): void {
    if (!this.monMenage) { this.chartData = null; return; }
    this.chartData = {
      labels: ['Résidents', ''],
      datasets: [{ data: [this.monMenage.nombreResidents || 0, 1], backgroundColor: ['#42a5f5','#e0e0e0'], borderWidth: 0 }]
    };
  }

  initChart(): void {
    this.chartOptions = {
      responsive: true, maintainAspectRatio: false,
      plugins: { legend: { position: 'bottom', display: this.isAgent } }
    };
  }

  get recentMenages(): Menage[] { return this.isAgent ? this.menages.slice(0, 5) : []; }

  formatLocalisation(menage: Menage): string {
    return [menage.region, menage.ville, menage.quartier, menage.adresse]
      .filter(Boolean).join(', ');
  }

  getCategorieSeverity(c: string | undefined): 'success'|'secondary'|'info'|'warning'|'danger'|undefined {
    if (!c) return 'secondary';
    const s = this.categorieSeverity[c];
    return (['danger','warning','info','success'].includes(s) ? s : 'secondary') as any;
  }

  getCategorieLabel(c: string | undefined): string {
    return c ? (this.categorieLabels[c] || c) : 'Non définie';
  }

  getResidentNomComplet(r: Resident): string { return `${r.nom} ${r.prenom}`.trim(); }

  getResidentAge(r: Resident): number | string {
    if (r.age) return r.age;
    if (r.dateNaissance) {
      const today = new Date(), birth = new Date(r.dateNaissance);
      let age = today.getFullYear() - birth.getFullYear();
      const m = today.getMonth() - birth.getMonth();
      if (m < 0 || (m === 0 && today.getDate() < birth.getDate())) age--;
      return age;
    }
    return '-';
  }

  getDiplomeLabel(v: string): string {
    return this.diplomes.find(d => d.value === v)?.label ?? v;
  }

  getTrancheSalarialeLabel(v: string): string {
    return this.tranchesSalariales.find(t => t.value === v)?.label ?? v;
  }
}
