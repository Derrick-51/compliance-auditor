import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { MessageService } from '../messages/message.service';
import { Audit } from '../components/review-audit/audit-list';

@Injectable({
  providedIn: 'root',
})
export class AuditListService {
  private auditsUrl = 'http://localhost:3000/api/audit/listall';
  constructor(
    private http: HttpClient,
    private messageService: MessageService
  ) {}

  data: Audit[] = [];

  //Calls backend functionality to list all audits under the current campagin
  getAudits(campaignID: any): Observable<Audit[]> {
    return this.http.get<Audit[]>(`${this.auditsUrl}/${campaignID}`);
  }
}
