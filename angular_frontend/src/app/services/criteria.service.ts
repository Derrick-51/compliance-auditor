import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Criterion } from '../interfaces/criterion';

@Injectable({
  providedIn: 'root'
})
export class CriteriaService {
  private readonly apiUrl = 'http://localhost:3000/api/criteria';

  constructor(private http: HttpClient) { }

  getCriteriaByCampaignID(campaignID: number): Observable<Criterion[]> {
    return this.http.get<Criterion[]>(`${this.apiUrl}?campaignID=${campaignID}`);
  }

  updateCriterion(criterion: any) {
    return this.http.patch<any>(`${this.apiUrl}/${criterion.id}`, criterion);
  }

  updateAllCriteria(criteria: any[]) {
    return this.http.put<any[]>(this.apiUrl, criteria);
  }
}