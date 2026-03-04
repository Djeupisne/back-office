// src/app/core/services/resident.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Resident, ResidentRequest } from '../models/resident.model';
import { environment } from '../../../environments/environment';

@Injectable({ providedIn: 'root' })
export class ResidentService {

  // ✅ CORRECTION: Utilisation de l'API Gateway avec les chemins /api/v1/residents et /api/v1/menages
  // src/app/core/services/resident.service.ts
private readonly RESIDENTS_URL = environment.apiUrl + '/api/v1/residents';
private readonly MENAGES_URL = environment.apiUrl + '/api/v1/menages';
  constructor(private http: HttpClient) {}

  getAll(): Observable<Resident[]> {
    return this.http.get<Resident[]>(this.RESIDENTS_URL);
  }

  getByMenage(menageId: string): Observable<Resident[]> {
    return this.http.get<Resident[]>(`${this.MENAGES_URL}/${menageId}/residents`);
  }

  getById(id: string): Observable<Resident> {
    return this.http.get<Resident>(`${this.RESIDENTS_URL}/${id}`);
  }

  getByCni(cni: string): Observable<Resident> {
    return this.http.get<Resident>(`${this.RESIDENTS_URL}/cni/${cni}`);
  }

  create(menageId: string, resident: ResidentRequest): Observable<Resident> {
    return this.http.post<Resident>(`${this.MENAGES_URL}/${menageId}/residents`, resident);
  }

  update(id: string, resident: ResidentRequest): Observable<Resident> {
    return this.http.put<Resident>(`${this.RESIDENTS_URL}/${id}`, resident);
  }

  delete(id: string): Observable<void> {
    return this.http.delete<void>(`${this.RESIDENTS_URL}/${id}`);
  }
}