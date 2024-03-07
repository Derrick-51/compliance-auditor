import { Component, OnInit, importProvidersFrom } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { MessageService } from '../../messages/message.service';
import { Audit } from './audit-list';
import { NgFor, NgIf, UpperCasePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { AuditListService } from '../../services/audit-list.service';
import { AuditorNavbarComponent } from '../auditor-navbar/auditor-navbar.component';

@Component({
  selector: 'app-review-audit',
  standalone: true,
  imports: [
    AuditorNavbarComponent,
    NgFor,
    FormsModule,
    NgIf,
    UpperCasePipe,
    MatButtonModule,
    MatCardModule,
    AuditorNavbarComponent,
  ],
  templateUrl: './review-audit.component.html',
  styleUrl: './review-audit.component.scss',
})
export class ReviewAuditComponent implements OnInit {
  constructor(
    private http: HttpClient,
    private messageService: MessageService,
    private auditlistService: AuditListService
  ) {}

  audits: Audit[] = [];

  selectedAudit?: Audit;

  getAudits() {
    // this.http
    // .get('http://localhost:3000/audit/listall')
    // .subscribe((data: any) => {
    //   console.log(data);
    //   this.audits = data;
    // });
    this.auditlistService.getAudits().subscribe((audits) => {
      this.audits = audits;
    });
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
