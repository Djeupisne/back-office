export interface Resident {
  id?: string;
  menageId: string;
  numeroCni: string;
  nom: string;
  estChef?: boolean;
  prenom: string;
  telephone?: string;
  dateNaissance: string;
  nationalite: string;
  diplome: string;
  estLettre?: boolean;
  trancheSalariale: string;
   chef: boolean;
  age?: number;
}

export interface ResidentRequest {
  menageId: string;
  numeroCni: string;
  nom: string;
  prenom: string;
  dateNaissance: string;
  nationalite: string;
  diplome: string;
  estLettre?: boolean;
  trancheSalariale: string;
}

export const TRANCHES_SALARIALES = [
  { label: '[0 ; 30 000[',           value: 'TRANCHE_1' },
  { label: '[30 000 ; 100 000[',     value: 'TRANCHE_2' },
  { label: '[100 000 ; 200 000[',    value: 'TRANCHE_3' },
  { label: '[200 000 ; 700 000[',    value: 'TRANCHE_4' },
  { label: '[700 000 ; 1 000 000[',  value: 'TRANCHE_5' },
  { label: '[1 000 000 ; plus[',     value: 'TRANCHE_6' }
];

export const DIPLOMES = [
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
