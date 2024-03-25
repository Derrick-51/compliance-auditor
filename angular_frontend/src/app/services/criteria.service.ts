import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Criterion } from '../interfaces/criterion';

@Injectable({
  providedIn: 'root'
})
export class CriteriaService {
  private readonly databaseUrl = 'http://localhost:3000/api/criteria';

  constructor(private http: HttpClient) { }

  getCriteriaByCampaignID(campaignID: number): Observable<Criterion[]> {
    return this.http.get<Criterion[]>(`${this.databaseUrl}?campaignID=${campaignID}`);
  }

  getCriteriaByID(id: number): Observable<Criterion[]> {
    const url = `${this.databaseUrl}/criteria/${id}`;
    return this.http.get<Criterion[]>(url);
  }

  updateCriterion(id: number, updatedCriterion: Criterion, files: File[]): Observable<any> {
    const formData = new FormData();
    formData.append('name', updatedCriterion.name);
    formData.append('guidelines', updatedCriterion.guidelines);
    formData.append('image', files[0]); // Assuming you're updating a single image

    // Send PATCH request to update criterion
    return this.http.patch<any>(`${this.databaseUrl}/${id}`, formData);
  }

  createCriterion(createCriteriaDto: any): Observable<Criterion> {
    return this.http.post<Criterion>(`${this.databaseUrl}/create`, createCriteriaDto);
  }

  deleteCriterion(criteriaID: number): Observable<void> {
    return this.http.delete<void>(`${this.databaseUrl}/${criteriaID}`);
  }
}