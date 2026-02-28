import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MenageService } from '../../../core/services/menage.service';
import { ResidentService } from '../../../core/services/resident.service';
import { Menage, CATEGORIE_LABELS, CATEGORIE_SEVERITY, getChef, getChefNom, getChefCni } from '../../../core/models/menage.model';
import { Resident, TRANCHES_SALARIALES } from '../../../core/models/resident.model';

@Component({
  selector: 'app-menage-detail',
  templateUrl: './menage-detail.component.html',
  styleUrls: ['./menage-detail.component.scss']
})
export class MenageDetailComponent implements OnInit {
  menage?: Menage;
  residents: Resident[] = [];
  loading = true;
  categorieLabels   = CATEGORIE_LABELS;
  categorieSeverity = CATEGORIE_SEVERITY;
  tranches          = TRANCHES_SALARIALES;

  // ✅ Fonctions helper exposées au template
  getChef    = getChef;
  getChefNom = getChefNom;
  getChefCni = getChefCni;

  constructor(
    private route:       ActivatedRoute,
    private router:      Router,
    private menageSvc:   MenageService,
    private residentSvc: ResidentService
  ) {}

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id')!;
    this.menageSvc.getById(id).subscribe({
      next: (m) => {
        this.menage = m;
        this.residentSvc.getByMenage(id).subscribe({
          next:  r => { this.residents = r; this.loading = false; },
          error: () => { this.loading = false; }
        });
      },
      error: () => { this.router.navigate(['/menages']); }
    });
  }

  getTrancheLabel(val: string): string {
    return this.tranches.find(t => t.value === val)?.label || val;
  }

  getScoreColor(): string {
    const s = this.menage?.score || 0;
    if (s < 20)  return '#ef5350';
    if (s < 45)  return '#ff9800';
    if (s <= 55) return '#42a5f5';
    if (s <= 70) return '#66bb6a';
    return '#26a69a';
  }
}