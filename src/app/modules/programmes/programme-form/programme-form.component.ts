import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { ProgrammeService } from '../../../core/services/programme.service';
import { SCORE_CATEGORIES } from '../../../core/models/programme.model';

@Component({
  selector: 'app-programme-form',
  templateUrl: './programme-form.component.html',
  styleUrls: ['./programme-form.component.scss']
})
export class ProgrammeFormComponent implements OnInit {
  form: FormGroup;
  saving  = false;
  loading = false;
  isEdit  = false;
  programmeId?: string;
  today = new Date();

  // ✅ Options pour le sélecteur de score min/max
  scoreCategories = SCORE_CATEGORIES;

  constructor(
    private fb:    FormBuilder,
    private svc:   ProgrammeService,
    private router: Router,
    private route:  ActivatedRoute,
    private msg:    MessageService
  ) {
    this.form = this.fb.group({
      nom:                  ['', Validators.required],
      description:          [''],
      scoreMinEligibilite:  [0, [Validators.required, Validators.min(0)]],
      scoreMaxEligibilite:  [null, [Validators.required, Validators.min(0)]],
      dateDebut:            [''],
      dateFin:              [''],
      budgetAlloue:         [null],
      responsable:          [''],
      region:               ['']
    });
  }

  ngOnInit(): void {
    this.programmeId = this.route.snapshot.paramMap.get('id') || undefined;
    if (this.programmeId) {
      this.isEdit  = true;
      this.loading = true;
      this.svc.getById(this.programmeId).subscribe({
        next: (p) => {
          this.form.patchValue({
            ...p,
            dateDebut: p.dateDebut ? new Date(p.dateDebut) : null,
            dateFin:   p.dateFin   ? new Date(p.dateFin)   : null
          });
          this.loading = false;
        },
        error: () => { this.loading = false; this.router.navigate(['/programmes']); }
      });
    }
  }

  // ✅ Reçoit directement l'objet depuis le dropdown
  applyCategorie(cat: { label: string; min: number; max: number } | null): void {
    if (!cat) return;
    this.form.patchValue({
      scoreMinEligibilite: cat.min,
      scoreMaxEligibilite: cat.max
    });
  }

  submit(): void {
    if (this.form.invalid) { this.form.markAllAsTouched(); return; }
    this.saving = true;

    const val = { ...this.form.value };

    // Formate les dates en yyyy-MM-dd
    if (val.dateDebut instanceof Date) val.dateDebut = val.dateDebut.toISOString().split('T')[0];
    if (val.dateFin   instanceof Date) val.dateFin   = val.dateFin.toISOString().split('T')[0];

    const obs = this.isEdit
      ? this.svc.update(this.programmeId!, val)
      : this.svc.create(val);

    obs.subscribe({
      next: () => {
        this.saving = false;
        this.msg.add({
          severity: 'success',
          summary:  'Succès',
          detail:   this.isEdit ? 'Programme modifié' : 'Programme créé'
        });
        setTimeout(() => this.router.navigate(['/programmes']), 1000);
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