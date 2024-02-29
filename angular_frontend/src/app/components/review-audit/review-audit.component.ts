import { Component } from '@angular/core';
import { navbarComponent } from '../navbar/navbar.component';
import { HttpClient } from '@angular/common/http';
import { MessageBundle } from '@angular/compiler';

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
    private messageService: MessageBundle
  ) {}
}
