import { Component } from '@angular/core';
import { navbarComponent } from '../navbar/navbar.component';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { MessageService } from '../../messages/message.service';
import { Audit } from './mock-audits';
import { NgFor, NgIf, UpperCasePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { AuditListService } from '../../services/audit-list.service';

@Component({
  selector: 'app-review-audit',
  standalone: true,
  imports: [
    navbarComponent,
    NgFor,
    FormsModule,
    NgIf,
    UpperCasePipe,
    MatButtonModule,
    MatCardModule,
  ],
  templateUrl: './review-audit.component.html',
  styleUrl: './review-audit.component.scss',
})
export class ReviewAuditComponent {
  constructor(
    private http: HttpClient,
    private messageService: MessageService,
    private auditlistService: AuditListService
  ) {}

  audits: Audit[] = [];

  selectedAudit?: Audit;

  getAudits(): void {
    this.auditlistService
      .getAudits()
      .subscribe((audits) => (this.audits = audits));
  }

  ngOnInit(): void {
    this.getAudits();
  }

  onSelect(audit: Audit): void {
    this.selectedAudit = audit;
  }

  private log(message: string) {
    this.messageService.add('AuditService: ${message}');
  }

  private auditsUrl = 'api/audit';
}
