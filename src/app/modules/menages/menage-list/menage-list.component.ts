// src/app/modules/menages/menage-list/menage-list.component.ts
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ConfirmationService, MessageService } from 'primeng/api';
import { MenageService } from '../../../core/services/menage.service';
import { Menage, CATEGORIE_LABELS, CATEGORIE_SEVERITY, getChefNom } from '../../../core/models/menage.model';

@Component({
  selector: 'app-menage-list',
  templateUrl: './menage-list.component.html',
  styleUrls: ['./menage-list.component.scss']
})
export class MenageListComponent implements OnInit {
  menages:   Menage[] = [];
  loading    = true;
  searchText = '';

  categorieLabels   = CATEGORIE_LABELS;
  categorieSeverity = CATEGORIE_SEVERITY;
  getChefNom        = getChefNom;

  constructor(
    private svc:     MenageService,
    private router:  Router,
    private confirm: ConfirmationService,
    private msg:     MessageService
  ) {}

  ngOnInit(): void { this.load(); }

  load(): void {
    this.loading = true;
    this.svc.getAll().subscribe({
      next:  d => { this.menages = d; this.loading = false; },
      error: () => { this.loading = false; }
    });
  }

  get filtered(): Menage[] {
    if (!this.searchText) return this.menages;
    const s = this.searchText.toLowerCase();
    return this.menages.filter(m =>
      getChefNom(m).toLowerCase().includes(s) ||
      m.categorie?.toLowerCase().includes(s)  ||
      m.code?.toLowerCase().includes(s)
    );
  }

  delete(m: Menage): void {
    this.confirm.confirm({
      message:                `Supprimer le ménage de "${getChefNom(m)}" ?`,
      header:                 'Confirmation de suppression',
      icon:                   'pi pi-exclamation-triangle',
      acceptLabel:            'Supprimer',
      rejectLabel:            'Annuler',
      acceptButtonStyleClass: 'p-button-danger',
      accept: () => {
        this.svc.delete(m.id!).subscribe({
          next:  () => {
            this.msg.add({ severity: 'success', summary: 'Succès', detail: 'Ménage supprimé' });
            this.load();
          },
          error: () => this.msg.add({ severity: 'error', summary: 'Erreur', detail: 'Impossible de supprimer' })
        });
      }
    });
  }
}
