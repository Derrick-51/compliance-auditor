import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Criterion } from '../interfaces/criterion';

@Injectable({
  providedIn: 'root'
})
export class CriteriaService {
  private readonly criteriaUrl = 'http://localhost:3000/api/criteria';

  constructor(private http: HttpClient) { }

  getCriteriaByID(id: number): Observable<Criterion[]> {
    const url = `${this.criteriaUrl}/${id}`;
    return this.http.get<Criterion[]>(url);
  }

  updateCriterion(id: number, updatedCriterion: Criterion, files: File[]): Observable<any> {
    const formData = new FormData();
    formData.append('name', updatedCriterion.name);
    formData.append('guidelines', updatedCriterion.guidelines);
    formData.append('image', files[0]); // Assuming you're updating a single image

    // Send PATCH request to update criterion
    return this.http.patch<any>(`${this.criteriaUrl}/${id}`, formData);
  }

  createCriterion(createCriterionDto: any): Observable<Criterion> {
    return this.http.post<Criterion>(`${this.criteriaUrl}/create`, createCriterionDto);
  }

  deleteCriterion(criteriaID: number): Observable<void> {
    return this.http.delete<void>(`${this.criteriaUrl}/${criteriaID}`);
  }
}