import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private profileURL = 'http://localhost:3000/auth/profile';
  constructor(private http: HttpClient) {}

  //Calls functionality to grab user information
  getUserProfile(): Observable<any> {
    return this.http.get<any>(this.profileURL);
  }

  //Calls functionality to update user profile
  updateProfile(userId: number, updatedData: any) {
    return this.http.put<any>(
      `http://localhost:3000/api/users/${userId}`,
      updatedData
    );
  }

  //Calls functionality to get user information
  getUser(userId: string): Observable<any> {
    return this.http.get<any>(`http://localhost:3000/api/users/${userId}`);
  }
}
