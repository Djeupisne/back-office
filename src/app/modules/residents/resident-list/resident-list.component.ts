import { Component, OnInit } from '@angular/core';
import { ConfirmationService, MessageService } from 'primeng/api';
import { ResidentService } from '../../../core/services/resident.service';
import { MenageService } from '../../../core/services/menage.service';
import { Resident, TRANCHES_SALARIALES } from '../../../core/models/resident.model';
import { forkJoin, of } from 'rxjs';
import { switchMap } from 'rxjs/operators';

@Component({
  selector: 'app-resident-list',
  templateUrl: './resident-list.component.html',
  styleUrls: ['./resident-list.component.scss']
})
export class ResidentListComponent implements OnInit {
  residents: Resident[] = [];
  loading = true;
  searchText = '';
  tranches = TRANCHES_SALARIALES;

  constructor(
    private svc:       ResidentService,
    private menageSvc: MenageService,
    private confirm:   ConfirmationService,
    private msg:       MessageService
  ) {}

  ngOnInit(): void { this.load(); }

  load(): void {
    this.loading = true;
    this.menageSvc.getAll().pipe(
      switchMap(menages => {
        if (!menages.length) return of([] as Resident[][]);
        // ✅ Pour chaque ménage, charge ses résidents via GET /menages/{id}/residents
        return forkJoin(menages.map(m => this.svc.getByMenage(m.id!)));
      })
    ).subscribe({
      next: (results: Resident[][]) => {
        this.residents = results.flat();
        this.loading = false;
      },
      error: () => { this.loading = false; }
    });
  }

  get filtered(): Resident[] {
    if (!this.searchText) return this.residents;
    const s = this.searchText.toLowerCase();
    return this.residents.filter(r =>
      r.nom?.toLowerCase().includes(s) ||
      r.prenom?.toLowerCase().includes(s) ||
      r.numeroCni?.toLowerCase().includes(s)
    );
  }

  getTrancheLabel(val: string): string {
    return this.tranches.find(t => t.value === val)?.label || val;
  }

  delete(r: Resident): void {
    this.confirm.confirm({
      message:               `Supprimer le résident "${r.nom} ${r.prenom}" ?`,
      header:                'Confirmation',
      icon:                  'pi pi-exclamation-triangle',
      acceptLabel:           'Supprimer',
      rejectLabel:           'Annuler',
      acceptButtonStyleClass:'p-button-danger',
      accept: () => {
        this.svc.delete(r.id!).subscribe({
          next:  () => {
            this.msg.add({ severity: 'success', summary: 'Succès', detail: 'Résident supprimé' });
            this.load();
          },
          error: () => this.msg.add({ severity: 'error', summary: 'Erreur', detail: 'Impossible de supprimer' })
        });
      }
    });
  }
}