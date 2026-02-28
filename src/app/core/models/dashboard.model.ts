export interface DashboardStats {
  totalMenages: number;
  totalResidents: number;
  totalProgrammes: number;
  totalAgents: number;
  menagesParCategorie: Record<string, number>;
  menagesRecents: MenageRecent[];
}

export interface MenageRecent {
  id: string;
  chefNom: string;
  categorie: string;
  score: number;
  createdAt: string;
}
