import { Resident } from './resident.model';
export { Resident };

export interface Menage {
  id?: string;
  code?: string;
  aTelevision: boolean;
  aRadio: boolean;
  aMoto: boolean;
  aVoiture: boolean;
  statutHabitation: StatutHabitation;
  score?: number;
  categorie?: string;
  categorieLabel?: string;
  region?: string;
  ville?: string;
  quartier?: string;
  adresse?: string;
  nombreResidents?: number;
  nomChef?: string;         // ✅ champ backend MenageResponse
  chefEmail?: string;       // ✅ ajouté (optionnel, peut être null)
  chefNumeroCni?: string;   // ✅ optionnel
  residents?: Resident[];
  createdAt?: string;
  updatedAt?: string;
}
export enum StatutHabitation {
  PROPRIETAIRE = 'PROPRIETAIRE',
  LOCATAIRE    = 'LOCATAIRE'
}

export enum CategorieMenage {
  TRES_VULNERABLE = 'TRES_VULNERABLE',
  VULNERABLE      = 'VULNERABLE',
  A_RISQUE        = 'A_RISQUE',
  NON_VULNERABLE  = 'NON_VULNERABLE',
  RICHE           = 'RICHE',
  TRES_RICHE      = 'TRES_RICHE'
}

export const CATEGORIE_LABELS: Record<string, string> = {
  'TRES_VULNERABLE': 'Très vulnérable',
  'VULNERABLE':      'Vulnérable',
  'A_RISQUE':        'À risque',
  'NON_VULNERABLE':  'Non vulnérable',
  'RICHE':           'Riche',
  'TRES_RICHE':      'Très riche'
};

export const CATEGORIE_SEVERITY: Record<string, string> = {
  'TRES_VULNERABLE': 'danger',
  'VULNERABLE':      'warning',
  'A_RISQUE':        'info',
  'NON_VULNERABLE':  'success',
  'RICHE':           'success',
  'TRES_RICHE':      'success'
};

export interface MenageRequest {
  aTelevision: boolean;
  aRadio: boolean;
  aMoto: boolean;
  aVoiture: boolean;
  statutHabitation: StatutHabitation;
  region?: string;
  ville?: string;
  quartier?: string;
  adresse?: string;
  residents: any[];
}

// ✅ Corrigé — le "/" parasite est supprimé
export function getChef(menage: Menage): Resident | undefined {
  return menage.residents?.find(r => r.chef);
}

export function getChefNom(menage: Menage): string {
  // ✅ nomChef vient de MenageResponse, residents du MenageDetailResponse
  if (menage.nomChef) return menage.nomChef;
  const chef = getChef(menage);
  if (!chef) return menage.code ?? '-';
  return `${chef.nom ?? ''} ${chef.prenom ?? ''}`.trim();
}

export function getChefCni(menage: Menage): string {
  return getChef(menage)?.numeroCni ?? '-';
}