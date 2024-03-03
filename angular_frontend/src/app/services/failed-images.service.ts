import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { FailedImage } from '../interfaces/failed-image';

@Injectable({
  providedIn: 'root'
})
export class FailedImagesService {
  private baseUrl = 'http://localhost:3000';
  constructor(private http: HttpClient) { }

  getFailedImagesForAudit(auditId: number): Observable<FailedImage[]> {
    const url = `${this.baseUrl}/failed-images/${auditId}`;
    return this.http.get<FailedImage[]>(url);
  }
}
