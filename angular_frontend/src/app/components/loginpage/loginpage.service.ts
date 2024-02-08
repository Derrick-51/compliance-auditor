import { Injectable, Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class LoginpageService {
  constructor(private http: HttpClient) {}

  submitForm(email: string, password: string): Observable<any> {
    return this.http.post<any>('/auth/login', { email, password });
  }
}
