import { Component, OnInit } from '@angular/core';
import { ConfirmationService, MessageService } from 'primeng/api';
import { ProgrammeService } from '../../../core/services/programme.service';
import { Programme } from '../../../core/models/programme.model';
import { CATEGORIE_LABELS, CATEGORIE_SEVERITY } from '../../../core/models/menage.model';

@Component({
  selector: 'app-programme-list',
  templateUrl: './programme-list.component.html',
  styleUrls: ['./programme-list.component.scss']
})
export class ProgrammeListComponent implements OnInit {
  programmes: Programme[] = [];
  loading = true;
  eligiblesDialogVisible = false;
  selectedProgramme?: Programme;
  menagesEligibles: any[] = [];
  loadingEligibles = false;
  categorieLabels   = CATEGORIE_LABELS;
  categorieSeverity = CATEGORIE_SEVERITY;

  constructor(
    private svc:     ProgrammeService,
    private confirm: ConfirmationService,
    private msg:     MessageService
  ) {}

  ngOnInit(): void { this.load(); }

  load(): void {
    this.loading = true;
    this.svc.getAll().subscribe({
      next:  d => { this.programmes = d; this.loading = false; },
      error: () => { this.loading = false; }
    });
  }

  // ✅ Affiche la plage de score sous forme lisible
  getScoreRange(p: Programme): string {
    return `Score : ${p.scoreMinEligibilite} – ${p.scoreMaxEligibilite} pts`;
  }

  viewEligibles(p: Programme): void {
    this.selectedProgramme = p;
    this.eligiblesDialogVisible = true;
    this.loadingEligibles = true;
    this.svc.getMenagesEligibles(p.id!).subscribe({
      next:  d => { this.menagesEligibles = d; this.loadingEligibles = false; },
      error: () => { this.loadingEligibles = false; }
    });
  }

  delete(p: Programme): void {
    this.confirm.confirm({
      message:               `Supprimer le programme "${p.nom}" ?`,
      header:                'Confirmation',
      icon:                  'pi pi-exclamation-triangle',
      acceptLabel:           'Supprimer',
      rejectLabel:           'Annuler',
      acceptButtonStyleClass:'p-button-danger',
      accept: () => {
        this.svc.delete(p.id!).subscribe({
          next:  () => { this.msg.add({ severity: 'success', summary: 'Succès', detail: 'Programme supprimé' }); this.load(); },
          error: ()  => this.msg.add({ severity: 'error', summary: 'Erreur', detail: 'Impossible de supprimer' })
        });
      }
    });
  }
}