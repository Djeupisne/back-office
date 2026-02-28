import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Resident, ResidentRequest } from '../models/resident.model';

@Injectable({ providedIn: 'root' })
export class ResidentService {

  private readonly BASE = '/api/v1';

  constructor(private http: HttpClient) {}

  // ✅ Pas d'endpoint getAll côté backend — on passe par les ménages
  getAll(): Observable<Resident[]> {
    return this.http.get<Resident[]>(`${this.BASE}/residents`);
  }

  getByMenage(menageId: string): Observable<Resident[]> {
    return this.http.get<Resident[]>(`${this.BASE}/menages/${menageId}/residents`);
  }

  getById(id: string): Observable<Resident> {
    return this.http.get<Resident>(`${this.BASE}/residents/${id}`);
  }

  getByCni(cni: string): Observable<Resident> {
    return this.http.get<Resident>(`${this.BASE}/residents/cni/${cni}`);
  }

  create(menageId: string, resident: ResidentRequest): Observable<Resident> {
    return this.http.post<Resident>(`${this.BASE}/menages/${menageId}/residents`, resident);
  }

  update(id: string, resident: ResidentRequest): Observable<Resident> {
    return this.http.put<Resident>(`${this.BASE}/residents/${id}`, resident);
  }

  delete(id: string): Observable<void> {
    return this.http.delete<void>(`${this.BASE}/residents/${id}`);
  }
}