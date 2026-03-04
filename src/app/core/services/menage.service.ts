// src/app/core/services/menage.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Menage, MenageRequest } from '../models/menage.model';
import { Resident } from '../models/resident.model';

@Injectable({ providedIn: 'root' })
export class MenageService {

  // FIX — Gateway /api/main/** StripPrefix=2 => main-service recoit /api/v1/menages
  private readonly API = '/api/main/api/v1/menages';

  constructor(private http: HttpClient) {}

  getAll(): Observable<Menage[]> {
    return this.http.get<any>(this.API).pipe(
      map(r => r.content ?? r)  // gere Page<> et List<>
    );
  }

  getById(id: string): Observable<Menage> {
    return this.http.get<Menage>(`${this.API}/${id}`);
  }

  getByCode(code: string): Observable<Menage> {
    return this.http.get<Menage>(`${this.API}/code/${code}`);
  }

  getResidents(menageId: string): Observable<Resident[]> {
    return this.http.get<Resident[]>(`${this.API}/${menageId}/residents`);
  }

  getByCategorie(categorie: string): Observable<Menage[]> {
    return this.http.get<Menage[]>(`${this.API}/categorie/${categorie}`);
  }

  create(menage: MenageRequest): Observable<Menage> {
    return this.http.post<Menage>(this.API, menage);
  }

  update(id: string, menage: MenageRequest): Observable<Menage> {
    return this.http.put<Menage>(`${this.API}/${id}`, menage);
  }

  // RESTAURE: delete() utilise par menage-list.component.ts
  // Note: l'endpoint DELETE n'est pas declare dans MenageController.java
  // Si 404, il faudra l'ajouter cote backend
  delete(id: string): Observable<void> {
    return this.http.delete<void>(`${this.API}/${id}`);
  }

  // RESTAURE: getMenageByChef() attend un userId et redirige vers getById()
  // car /by-chef/{id} n'existe pas cote backend
  getMenageByChef(userId: string): Observable<Menage> {
    return this.getById(userId);
  }
}
