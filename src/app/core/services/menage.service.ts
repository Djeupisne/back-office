import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Menage, MenageRequest } from '../models/menage.model';
import { Resident } from '../models/resident.model';
import { map } from 'rxjs/operators';
@Injectable({ providedIn: 'root' })
export class MenageService {

  // ✅ URL CORRECTE - sans le préfixe /api qui est enlevé par l'API Gateway
  private readonly API = '/api/v1/menages';

  // Optionnel: URL de secours si besoin
  private readonly API_GATEWAY = 'http://localhost:9000/main/api/v1/menages';

  constructor(private http: HttpClient) {}

  /**
   * Récupère tous les ménages (pour les agents)
   */


  getAll(): Observable<Menage[]> {
    console.log('📡 Récupération de tous les ménages');
    return this.http.get<any>(this.API).pipe(
      map(response => response.content ?? response) // ✅ gère Page<> et List<>
    );
  }

  /**
   * Récupère un ménage par son ID
   */
  getById(id: string): Observable<Menage> {
    console.log(`📡 Récupération du ménage: ${id}`);
    return this.http.get<Menage>(`${this.API}/${id}`);
  }

  /**
   * Récupère le ménage d'un chef spécifique (pour les chefs)
   */
  getMenageByChef(chefId: string): Observable<Menage> {
    console.log(`📡 Récupération du ménage du chef: ${chefId}`);
    return this.http.get<Menage>(`${this.API}/by-chef/${chefId}`);
  }

  /**
   * Récupère les résidents d'un ménage
   */
  getResidents(menageId: string): Observable<Resident[]> {
    console.log(`📡 Récupération des résidents du ménage: ${menageId}`);
    return this.http.get<Resident[]>(`${this.API}/${menageId}/residents`);
  }

  /**
   * Crée un nouveau ménage
   */
  create(menage: MenageRequest): Observable<Menage> {
    console.log('📡 Création d\'un nouveau ménage', menage);
    return this.http.post<Menage>(this.API, menage);
  }

  /**
   * Met à jour un ménage existant
   */
  update(id: string, menage: MenageRequest): Observable<Menage> {
    console.log(`📡 Mise à jour du ménage: ${id}`, menage);
    return this.http.put<Menage>(`${this.API}/${id}`, menage);
  }

  /**
   * Supprime un ménage
   */
  delete(id: string): Observable<void> {
    console.log(`📡 Suppression du ménage: ${id}`);
    return this.http.delete<void>(`${this.API}/${id}`);
  }

  /**
   * Récupère les statistiques globales (pour le dashboard)
   */
  getStats(): Observable<any> {
    console.log('📡 Récupération des statistiques');
    return this.http.get<any>(`${this.API}/stats`);
  }

  /**
   * Récupère les ménages éligibles à un programme
   */
  getEligiblesForProgram(programmeId: string): Observable<Menage[]> {
    console.log(`📡 Récupération des ménages éligibles au programme: ${programmeId}`);
    return this.http.get<Menage[]>(`${this.API}/eligibles/${programmeId}`);
  }

  /**
   * Calcule le score d'un ménage (via scoring-service)
   */
  calculateScore(menageId: string): Observable<any> {
    console.log(`📡 Calcul du score pour le ménage: ${menageId}`);
    return this.http.post<any>(`${this.API}/${menageId}/calculate-score`, {});
  }

  /**
   * Vérifie si l'API répond
   */
  healthCheck(): Observable<any> {
    return this.http.get<any>(`${this.API}/actuator/health`);
  }
}