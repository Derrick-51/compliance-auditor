import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { User } from '../interfaces/auth';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private databaseURL = 'http://localhost:3000';

  constructor(private http: HttpClient) {}

  loginUser(userDetails: User) {
    return this.http.post('${this.databaseURL}/users', userDetails);
  }
}
