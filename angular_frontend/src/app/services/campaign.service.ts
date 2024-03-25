import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CampaignService {
  private allURL = 'http://localhost:3000/api/campaign/all';
  private oneURL = 'http://localhost:3000/api/campaign';

  constructor(private http: HttpClient) { }

  createCampaign(body: any): Observable<any> {
    return this.http.post(this.oneURL, body)
  }

  getAllCampaigns(): Observable<any> {
    return this.http.get<any>(this.allURL);
  }

  getCampaign(id: number): Observable<any> {
    return this.http.get<any>(`${this.oneURL}/${id}`)
  }

  updateCampaign(id: number, body: any): Observable<any> {
    return this.http.patch<any>(`${this.oneURL}/${id}`, body)
  }

  deleteCampaign(id: number): Observable<any> {
    return this.http.delete<any>(`${this.oneURL}/${id}`)
  }
}
