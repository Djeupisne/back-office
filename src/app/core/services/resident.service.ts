import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Resident, ResidentRequest } from '../models/resident.model';
@Injectable({ providedIn: 'root' })
export class ResidentService {
  private readonly BASE = '/api/main/api/v1';
  constructor(private http: HttpClient) {}
  getAll() { return this.http.get<Resident[]>(`${this.BASE}/residents`); }
  getByMenage(id: string) { return this.http.get<Resident[]>(`${this.BASE}/menages/${id}/residents`); }
  getById(id: string) { return this.http.get<Resident>(`${this.BASE}/residents/${id}`); }
  getByCni(cni: string) { return this.http.get<Resident>(`${this.BASE}/residents/cni/${cni}`); }
  create(menageId: string, r: ResidentRequest) { return this.http.post<Resident>(`${this.BASE}/menages/${menageId}/residents`, r); }
  update(id: string, r: ResidentRequest) { return this.http.put<Resident>(`${this.BASE}/residents/${id}`, r); }
  delete(id: string): Observable<void> { return this.http.delete<void>(`${this.BASE}/residents/${id}`); }
}
