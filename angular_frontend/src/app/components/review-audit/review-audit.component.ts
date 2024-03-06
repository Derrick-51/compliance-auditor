import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { AuditorNavbarComponent } from '../auditor-navbar/auditor-navbar.component';

@Component({
  selector: 'app-review-audit',
  standalone: true,
  imports: [CommonModule, AuditorNavbarComponent],
  templateUrl: './review-audit.component.html',
  styleUrl: './review-audit.component.scss'
})
export class ReviewAuditComponent {

}
