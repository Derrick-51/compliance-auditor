import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Audit } from '../interfaces/audit-status';

@Injectable({
  providedIn: 'root'
})
export class LatestAuditService {
  private baseUrl = 'http://localhost:3000';
  constructor(private http: HttpClient) { }

  getLatestAuditForDealership(dealershipId: number): Observable<Audit> {
    return this.http.get<Audit>(`${this.baseUrl}/latest-audit/${dealershipId}`);
  }
}
