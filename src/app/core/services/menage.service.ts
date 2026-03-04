// src/app/core/services/menage.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Menage, MenageRequest } from '../models/menage.model';
import { Resident } from '../models/resident.model';
import { environment } from '../../../environments/environment';

@Injectable({ providedIn: 'root' })
export class MenageService {

  // ✅ CORRECTION: Utilisation de l'API Gateway avec le chemin /api/v1/menages
  private readonly BASE_URL = environment.mainUrl + '/api/v1/menages';

  constructor(private http: HttpClient) {}

  getAll(): Observable<Menage[]> {
    return this.http.get<any>(this.BASE_URL).pipe(
      map(r => r.content ?? r)  // gère Page<> et List<>
    );
  }

  getById(id: string): Observable<Menage> {
    return this.http.get<Menage>(`${this.BASE_URL}/${id}`);
  }

  getByCode(code: string): Observable<Menage> {
    return this.http.get<Menage>(`${this.BASE_URL}/code/${code}`);
  }

  getResidents(menageId: string): Observable<Resident[]> {
    return this.http.get<Resident[]>(`${this.BASE_URL}/${menageId}/residents`);
  }

  getByCategorie(categorie: string): Observable<Menage[]> {
    return this.http.get<Menage[]>(`${this.BASE_URL}/categorie/${categorie}`);
  }

  create(menage: MenageRequest): Observable<Menage> {
    return this.http.post<Menage>(this.BASE_URL, menage);
  }

  update(id: string, menage: MenageRequest): Observable<Menage> {
    return this.http.put<Menage>(`${this.BASE_URL}/${id}`, menage);
  }

  delete(id: string): Observable<void> {
    return this.http.delete<void>(`${this.BASE_URL}/${id}`);
  }

  getMenageByChef(userId: string): Observable<Menage> {
    return this.getById(userId);
  }
}