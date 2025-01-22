import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, map } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CampaignService {
  private baseURL = 'http://localhost:3000/api/campaign';

  constructor(private http: HttpClient) { }

  createCampaign(body: any): Observable<any> {
    return this.http.post(this.baseURL, body)
  }

  getAllCampaigns(): Observable<any> {
    return this.http.get<any>(this.baseURL);
  }

  getCampaign(id: number): Observable<any> {
    return this.http.get<any>(`${this.baseURL}/${id}`)
  }

  updateCampaign(id: number, body: any): Observable<any> {
    return this.http.patch<any>(`${this.baseURL}/${id}`, body)
  }

  deleteCampaign(id: number): Observable<any> {
    return this.http.delete<any>(`${this.baseURL}/${id}`)
  }

  getLatestCampaign(): Observable<any> {
    return this.http.get<any>(`${this.baseURL}/latest`);
  }
}
