// src/app/core/services/programme.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Programme } from '../models/programme.model';
import { environment } from '../../../environments/environment';

@Injectable({ providedIn: 'root' })
export class ProgrammeService {

  // ✅ CORRECTION: Utilisation de l'API Gateway avec le chemin /api/v1/programmes
  // src/app/core/services/programme.service.ts
private readonly BASE_URL = environment.apiUrl + '/api/v1/programmes';

  constructor(private http: HttpClient) {}

  getAll(): Observable<Programme[]> {
    return this.http.get<Programme[]>(this.BASE_URL);
  }

  getById(id: string): Observable<Programme> {
    return this.http.get<Programme>(`${this.BASE_URL}/${id}`);
  }

  create(p: Programme): Observable<Programme> {
    return this.http.post<Programme>(this.BASE_URL, p);
  }

  update(id: string, p: Programme): Observable<Programme> {
    return this.http.put<Programme>(`${this.BASE_URL}/${id}`, p);
  }

  delete(id: string): Observable<void> {
    return this.http.delete<void>(`${this.BASE_URL}/${id}`);
  }

  getMenagesEligibles(programmeId: string): Observable<any[]> {
    return this.http.get<any[]>(`${this.BASE_URL}/${programmeId}/menages-eligibles`);
  }

  // ✅ CORRECTION: Utilisation du bon endpoint /toggle
  toggleStatut(id: string): Observable<Programme> {
    return this.http.patch<Programme>(`${this.BASE_URL}/${id}/toggle`, {});
  }

  getProgrammesActifs(): Observable<Programme[]> {
    return this.http.get<Programme[]>(`${this.BASE_URL}/actifs`);
  }
}