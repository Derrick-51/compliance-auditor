import { Injectable } from '@angular/core';
import { HttpClient, HttpRequest, HttpEvent } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class FileUploadService {
  private baseUrl = 'http://localhost:3000';
  constructor(private http: HttpClient) {}

  // Upload a file
  upload(file: File): Observable<HttpEvent<any>> {
    const formData: FormData = new FormData();

    formData.append('images', file);
    const req = new HttpRequest('POST', `${this.baseUrl}/api/upload`, formData, {
      responseType: 'json'
    });

    return this.http.request(req);
  }
}