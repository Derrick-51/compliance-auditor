import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Images } from '../components/review-audit/audit-list';
@Injectable({
  providedIn: 'root',
})
export class ImageService {
  private imageUrl = 'http://localhost:3000/api/evidence';

  constructor(private http: HttpClient) {}

  createImage(
    auditID: number,
    criterionID: number,
    file: File
  ): Observable<any> {
    const formData = new FormData();
    formData.append('auditID', auditID.toString());
    formData.append('criterionID', criterionID.toString());
    formData.append('image', file);

    return this.http.post<any>(this.imageUrl, formData);
  }
}
