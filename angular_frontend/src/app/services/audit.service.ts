import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, catchError, map, switchMap, throwError } from 'rxjs';
//import { Audit } from '../interfaces/audit';
import { Audit } from '../components/review-audit/audit-list';

@Injectable({
  providedIn: 'root',
})
export class AuditService {
  private auditUrl = 'http://localhost:3000/api/audit';

  constructor(private http: HttpClient) {}

  createAudit(userEmail: string, campaignID: number): Observable<any> {
    const body = { userEmail, campaignID };
    return this.http.post<any>(this.auditUrl, body);
  }

  // Function to retrieve an audit of a specified user and campaign
  getAuditByUserAndCampaign(
    userID: number,
    campaignID: number
  ): Observable<any> {
    const url = `${this.auditUrl}/user/${userID}/campaign/${campaignID}`;
    return this.http.get<any>(url);
  }

  //function that will update the finalVerdict from the override page
  updateFinalVerdict(auditID: number, finalVerdict: string): Observable<Audit> {
    const url = `${this.auditUrl}/update-final-verdict/${finalVerdict}/selected-audit/${auditID}`;
    return this.http.patch<Audit>(url, { finalVerdict }).pipe(
      catchError((error: any) => {
        console.error('Error occurred:"', error);
        return throwError(error);
      })
    );
  }
}
