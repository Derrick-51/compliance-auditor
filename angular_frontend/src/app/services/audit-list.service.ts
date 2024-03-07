import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { MessageService } from '../messages/message.service';
import { AUDITS, Audit } from '../components/review-audit/mock-audits';

@Injectable({
  providedIn: 'root',
})
export class AuditListService {
  private auditsUrl = 'https://localhost:3000/audit/listall';
  constructor(
    private http: HttpClient,
    private messageService: MessageService
  ) {}

  getAudits(): Observable<Audit[]> {
    return this.http.get<Audit[]>(this.auditsUrl);
  }
}
