import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Images } from '../interfaces/images';

@Injectable({
  providedIn: 'root'
})
export class FailedImagesService {
  private baseUrl = 'http://localhost:3000';
  constructor(private http: HttpClient) { }

  getFailedImagesForAudit(auditId: number): Observable<Images[]> {
    return this.http.get<Images[]>(`${this.baseUrl}/failed-images/${auditId}`);
  }
}
