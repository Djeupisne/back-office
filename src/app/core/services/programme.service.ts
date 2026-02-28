import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Programme } from '../models/programme.model';

@Injectable({ providedIn: 'root' })
export class ProgrammeService {

  // ✅ URL CORRECTE - sans le préfixe /api
  private readonly API = '/api/v1/programmes';

  // Optionnel: URL de secours
  private readonly API_GATEWAY = 'http://localhost:9000/admin/api/v1/programmes';

  constructor(private http: HttpClient) {}

  /**
   * Récupère tous les programmes sociaux
   */
  getAll(): Observable<Programme[]> {
    console.log('📡 Récupération de tous les programmes');
    return this.http.get<Programme[]>(this.API);
  }

  /**
   * Récupère un programme par son ID
   */
  getById(id: string): Observable<Programme> {
    console.log(`📡 Récupération du programme: ${id}`);
    return this.http.get<Programme>(`${this.API}/${id}`);
  }

  /**
   * Crée un nouveau programme social
   */
  create(programme: Programme): Observable<Programme> {
    console.log('📡 Création d\'un nouveau programme', programme);
    return this.http.post<Programme>(this.API, programme);
  }

  /**
   * Met à jour un programme existant
   */
  update(id: string, programme: Programme): Observable<Programme> {
    console.log(`📡 Mise à jour du programme: ${id}`, programme);
    return this.http.put<Programme>(`${this.API}/${id}`, programme);
  }

  /**
   * Supprime un programme
   */
  delete(id: string): Observable<void> {
    console.log(`📡 Suppression du programme: ${id}`);
    return this.http.delete<void>(`${this.API}/${id}`);
  }

  /**
   * Récupère les ménages éligibles à un programme
   */
  getMenagesEligibles(programmeId: string): Observable<any[]> {
    console.log(`📡 Récupération des ménages éligibles pour le programme: ${programmeId}`);
    return this.http.get<any[]>(`${this.API}/${programmeId}/menages-eligibles`);
  }

  /**
   * Active/Désactive un programme
   */
  toggleStatut(id: string, actif: boolean): Observable<Programme> {
    console.log(`📡 Changement de statut du programme: ${id} -> ${actif ? 'actif' : 'inactif'}`);
    return this.http.patch<Programme>(`${this.API}/${id}`, { actif });
  }

  /**
   * Récupère les statistiques des programmes
   */
  getStats(): Observable<any> {
    console.log('📡 Récupération des statistiques des programmes');
    return this.http.get<any>(`${this.API}/stats`);
  }

  /**
   * Vérifie si l'API répond
   */
  healthCheck(): Observable<any> {
    return this.http.get<any>(`${this.API}/actuator/health`);
  }
}