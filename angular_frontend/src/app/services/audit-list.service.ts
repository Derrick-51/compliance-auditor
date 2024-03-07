import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { MessageService } from '../messages/message.service';
import { Audit } from '../components/review-audit/audit-list';

@Injectable({
  providedIn: 'root',
})
export class AuditListService {
  private auditsUrl = 'http://localhost:3000/audit/listall';
  constructor(
    private http: HttpClient,
    private messageService: MessageService
  ) {}

  data: Audit[] = [];

  getAudits(): Observable<Audit[]> {
    return this.http.get<Audit[]>(this.auditsUrl); //wait for profile code
  }
}
