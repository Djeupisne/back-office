import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormArray, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { MenageService } from '../../../core/services/menage.service';
import { StatutHabitation } from '../../../core/models/menage.model';

@Component({
  selector: 'app-menage-form',
  templateUrl: './menage-form.component.html',
  styleUrls: ['./menage-form.component.scss']
})
export class MenageFormComponent implements OnInit {
  form: FormGroup;
  loading = false;
  saving  = false;
  isEdit  = false;
  menageId?: string;
  today = new Date();

  niveauxDiplome = [
    { label: 'Aucun (Illettré)',  value: 'AUCUN_ILLETRE' },
    { label: 'Aucun (Lettré)',    value: 'AUCUN_LETTREE' },
    { label: 'CEPE',              value: 'CEPE' },
    { label: 'BEPC',              value: 'BEPC' },
    { label: 'BAC',               value: 'BAC' },
    { label: 'BTS',               value: 'BTS' },
    { label: 'Licence',           value: 'LICENCE' },
    { label: 'Master',            value: 'MASTER' },
    { label: 'Doctorat',          value: 'DOCTORAT' }
  ];

  tranchesSalariales = [
    { label: '[0 ; 30 000[',           value: 'TRANCHE_1' },
    { label: '[30 000 ; 100 000[',     value: 'TRANCHE_2' },
    { label: '[100 000 ; 200 000[',    value: 'TRANCHE_3' },
    { label: '[200 000 ; 700 000[',    value: 'TRANCHE_4' },
    { label: '[700 000 ; 1 000 000[',  value: 'TRANCHE_5' },
    { label: '[1 000 000 ; plus[',     value: 'TRANCHE_6' }
  ];
  constructor(
    private fb:    FormBuilder,
    private svc:   MenageService,
    private router: Router,
    private route:  ActivatedRoute,
    private msg:    MessageService
  ) {
    this.form = this.fb.group({
      aTelevision:      [false],
      aRadio:           [false],
      aMoto:            [false],
      aVoiture:         [false],
      statutHabitation: [StatutHabitation.LOCATAIRE, Validators.required],
      region:           [''],
      ville:            [''],
      quartier:         [''],
      adresse:          [''],
      residents: this.fb.array([this.buildChefGroup()])
    });
  }

  ngOnInit(): void {
    this.menageId = this.route.snapshot.paramMap.get('id') || undefined;
    if (this.menageId) {
      this.isEdit  = true;
      this.loading = true;
      this.svc.getById(this.menageId).subscribe({
        next: (m) => { this.form.patchValue(m); this.loading = false; },
        error: () => { this.loading = false; this.router.navigate(['/menages']); }
      });
    }
  }

  // ✅ Groupe FormGroup pour le chef
  buildChefGroup(): FormGroup {
    return this.fb.group({
      numeroCni:       ['', [Validators.required, Validators.minLength(5)]],
      nom:             ['', Validators.required],
      prenom:          ['', Validators.required],
      nationalite:     ['Togolaise'],
      niveauDiplome:    ['AUCUN_ILLETRE', Validators.required], // ✅ corrigé
      trancheSalariale: ['TRANCHE_1', Validators.required],     // ✅ corrigé
      dateNaissance:   ['', Validators.required],
      telephone:       [''],
      chef:            [true]
    });
  }

  get chefGroup(): FormGroup {
    return (this.form.get('residents') as FormArray).at(0) as FormGroup;
  }

  submit(): void {
    if (this.form.invalid) { this.form.markAllAsTouched(); return; }
    this.saving = true;

    // Formate la date en LocalDate (yyyy-MM-dd)
    const raw = { ...this.form.value };
    const chef = { ...raw.residents[0] };
    if (chef.dateNaissance instanceof Date) {
      chef.dateNaissance = chef.dateNaissance.toISOString().split('T')[0];
    }
    raw.residents = [chef];

    const obs = this.isEdit
      ? this.svc.update(this.menageId!, raw)
      : this.svc.create(raw);

    obs.subscribe({
      next: () => {
        this.saving = false;
        this.msg.add({
          severity: 'success',
          summary:  'Succès',
          detail:   this.isEdit ? 'Ménage modifié' : 'Ménage créé avec succès'
        });
        setTimeout(() => this.router.navigate(['/menages']), 1000);
      },
      error: (err) => {
        this.saving = false;
        this.msg.add({
          severity: 'error',
          summary:  'Erreur',
          detail:   err.error?.message || 'Une erreur est survenue'
        });
      }
    });
  }
}