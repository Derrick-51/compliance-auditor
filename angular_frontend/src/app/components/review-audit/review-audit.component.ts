import { Component } from '@angular/core';
import { navbarComponent } from '../navbar/navbar.component';
import { MessageBundle } from '@angular/compiler';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { MessageService } from '../../messages/message.service';

@Component({
  selector: 'app-review-audit',
  standalone: true,
  imports: [navbarComponent, HttpClient],
  templateUrl: './review-audit.component.html',
  styleUrl: './review-audit.component.scss',
})
export class ReviewAuditComponent {
  constructor(
    private http: HttpClient,
    private messageService: MessageService
  ) {}

  private log(message: string) {
    this.messageService.add('AuditService: ${message}');
  }

  private auditsUrl = 'api/audit';
}
