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

  updateCriterion(criterion: any, files: File[] | null) {
    const formData: FormData = new FormData();
    formData.append('name', criterion.name);
    formData.append('guidelines', criterion.guidelines);
    formData.append('filename', criterion.filename);
    if (files && files.length > 0) {
      for (const file of files) {
        formData.append('files', file, file.name);
      }
    }
    return this.http.patch<any>(`${this.apiUrl}/${criterion.criteriaID}`, formData);
  }

  updateAllCriteria(criteria: any[]) {
    const formData = new FormData();
  
    criteria.forEach((criterion: any, index: number) => {
      formData.append(`criteria[${index}][name]`, criterion.name);
      formData.append(`criteria[${index}][guidelines]`, criterion.guidelines);
      formData.append(`criteria[${index}][filename]`, criterion.filename);
  
      if (criterion.files && criterion.files.length > 0) {
        criterion.files.forEach((file: File, fileIndex: number) => { // Specify types for file and fileIndex
          formData.append(`criteria[${index}][files][${fileIndex}]`, file, file.name);
        });
      }
    });
  
    return this.http.put<any[]>(`${this.apiUrl}/updateAll`, formData);
  }

  createCriterion(createCriteriaDto: any): Observable<Criterion> {
    return this.http.post<Criterion>(`${this.apiUrl}/create`, createCriteriaDto);
  }

  deleteCriterion(criteriaID: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${criteriaID}`);
  }
}