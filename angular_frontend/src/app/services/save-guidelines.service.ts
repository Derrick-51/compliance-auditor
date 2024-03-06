import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SaveGuidelinesService {

  private saveGuidelinesUrl = 'http://localhost:3000/api/save-guidelines'; 

  constructor(private http: HttpClient) { }

  save(guidelines: string): Observable<any> {
    // Define headers to specify the content type
    const headers = new HttpHeaders({
      'Content-Type': 'application/json'
    });

    // Post the guidelines data to the backend
    return this.http.post(this.saveGuidelinesUrl, { guidelines }, { headers });
  }
}