import { Component } from '@angular/core';
import { navbarComponent } from '../navbar/navbar.component';

@Component({
  selector: 'app-review-audit',
  standalone: true,
  imports: [navbarComponent],
  templateUrl: './review-audit.component.html',
  styleUrl: './review-audit.component.scss',
})
export class ReviewAuditComponent {}
