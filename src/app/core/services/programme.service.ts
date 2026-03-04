import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Programme } from '../models/programme.model';
@Injectable({ providedIn: 'root' })
export class ProgrammeService {
  // FIX - AVANT: '/api/v1/programmes'
  // APRES: '/api/admin/api/v1/programmes' (Gateway /api/admin/** => admin-service)
  private readonly API = '/api/admin/api/v1/programmes';
  constructor(private http: HttpClient) {}
  getAll(): Observable<Programme[]> { return this.http.get<Programme[]>(this.API); }
  getById(id: string): Observable<Programme> { return this.http.get<Programme>(`${this.API}/${id}`); }
  create(p: Programme): Observable<Programme> { return this.http.post<Programme>(this.API, p); }
  update(id: string, p: Programme): Observable<Programme> { return this.http.put<Programme>(`${this.API}/${id}`, p); }
  delete(id: string): Observable<void> { return this.http.delete<void>(`${this.API}/${id}`); }
  getMenagesEligibles(programmeId: string): Observable<any[]> { return this.http.get<any[]>(`${this.API}/${programmeId}/menages-eligibles`); }
  // FIX - AVANT: PATCH /{id} avec body {actif}
  // APRES: PATCH /{id}/toggle (endpoint reel dans ProgrammeSocialController.java)
  toggleStatut(id: string): Observable<Programme> { return this.http.patch<Programme>(`${this.API}/${id}/toggle`, {}); }
  getProgrammesActifs(): Observable<Programme[]> { return this.http.get<Programme[]>(`${this.API}/actifs`); }
}
