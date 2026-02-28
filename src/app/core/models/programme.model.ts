export interface Programme {
  id?: string;
  nom: string;
  description?: string;
  scoreMinEligibilite: number;
  scoreMaxEligibilite: number;
  dateDebut?: string;
  dateFin?: string;
  budgetAlloue?: number;
  responsable?: string;
  region?: string;
  actif?: boolean;
  createdAt?: string;
}

// ✅ Options de score correspondant aux catégories backend
export const SCORE_CATEGORIES = [
  { label: 'Très vulnérable (0–19 pts)',  min: 0,  max: 19  },
  { label: 'Vulnérable (20–44 pts)',       min: 20, max: 44  },
  { label: 'À risque (45–55 pts)',         min: 45, max: 55  },
  { label: 'Non vulnérable (56–70 pts)',   min: 56, max: 70  },
  { label: 'Riche (71–85 pts)',            min: 71, max: 85  },
  { label: 'Très riche (86–100 pts)',      min: 86, max: 100 }
];

export interface Menage {
  id: string;
  chefNom: string;
  score: number;
  categorie: string;
  nombreResidents: number;
}

export const CATEGORIES_OPTIONS = [
  { value: 'TRES_VULNERABLE', label: 'Très vulnérable' },
  { value: 'VULNERABLE', label: 'Vulnérable' },
  { value: 'A_RISQUE', label: 'À risque' },
  { value: 'NON_VULNERABLE', label: 'Non vulnérable' },
  { value: 'RICHE', label: 'Riche' },
  { value: 'TRES_RICHE', label: 'Très riche' }
];
