import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { ResidentService } from '../../../core/services/resident.service';
import { MenageService } from '../../../core/services/menage.service';
import { TRANCHES_SALARIALES, DIPLOMES } from '../../../core/models/resident.model';
import { Menage } from '../../../core/models/menage.model';

@Component({
  selector: 'app-resident-form',
  templateUrl: './resident-form.component.html',
  styleUrls: ['./resident-form.component.scss']
})
export class ResidentFormComponent implements OnInit {
  form: FormGroup;
  loading = false;
  saving  = false;
  isEdit  = false;
  residentId?: string;
  menages: { label: string; value: string }[] = [];
  tranches = TRANCHES_SALARIALES;
  diplomes = DIPLOMES;
  today = new Date();

  constructor(
    private fb:        FormBuilder,
    private svc:       ResidentService,
    private menageSvc: MenageService,
    private router:    Router,
    private route:     ActivatedRoute,
    private msg:       MessageService
  ) {
    this.form = this.fb.group({
      menageId:         ['', Validators.required],
      numeroCni:        ['', [Validators.required, Validators.minLength(5)]],
      nom:              ['', Validators.required],
      prenom:           ['', Validators.required],
      dateNaissance:    ['', Validators.required],
      nationalite:      ['Togolaise'],
      niveauDiplome:    ['AUCUN_ILLETRE', Validators.required],
      trancheSalariale: ['TRANCHE_1', Validators.required],
      telephone:        [''],
      estLettre:        [false]
    });
  }

  get showEstLettre(): boolean {
    return this.form.get('niveauDiplome')?.value === 'AUCUN_ILLETRE' ||
           this.form.get('niveauDiplome')?.value === 'AUCUN_LETTREE';
  }

  ngOnInit(): void {
    this.menageSvc.getAll().subscribe({
      next: (menages: Menage[]) => {
        // ✅ nomChef au lieu de chefNom (nom exact du backend)
        this.menages = menages.map(x => ({
          label: `${x.nomChef ?? x.code ?? 'Ménage'} (${x.code ?? '-'})`,
          value: x.id!
        }));
      }
    });

    const menageIdParam = this.route.snapshot.queryParamMap.get('menageId');
    if (menageIdParam) this.form.patchValue({ menageId: menageIdParam });

    this.residentId = this.route.snapshot.paramMap.get('id') || undefined;
    if (this.residentId) {
      this.isEdit  = true;
      this.loading = true;
      this.svc.getById(this.residentId).subscribe({
        next: (r) => {
          this.form.patchValue({
            ...r,
            dateNaissance: r.dateNaissance ? new Date(r.dateNaissance) : null
          });
          this.loading = false;
        },
        error: () => { this.loading = false; this.router.navigate(['/residents']); }
      });
    }
  }

  submit(): void {
    if (this.form.invalid) { this.form.markAllAsTouched(); return; }
    this.saving = true;

    const val = { ...this.form.value };
    if (val.dateNaissance instanceof Date) {
      val.dateNaissance = val.dateNaissance.toISOString().split('T')[0];
    }

    const menageId = val.menageId;
    const { menageId: _, ...payload } = val;

    const obs = this.isEdit
      ? this.svc.update(this.residentId!, payload)
      : this.svc.create(menageId, payload);

    obs.subscribe({
      next: () => {
        this.saving = false;
        this.msg.add({
          severity: 'success',
          summary:  'Succès',
          detail:   this.isEdit ? 'Résident modifié' : 'Résident ajouté'
        });
        setTimeout(() => this.router.navigate(['/residents']), 1000);
      },
      error: (err) => {
        this.saving = false;
        this.msg.add({
          severity: 'error',
          summary:  'Erreur',
          detail:   err.error?.message || 'Erreur lors de la sauvegarde'
        });
      }
    });
  }
}