import { Component, OnInit } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { RouterLink } from '@angular/router';
import { navbarComponent } from '../navbar/navbar.component';
import { Audit } from '../../interfaces/audit-status';
import { Images } from '../../interfaces/images';
import { LatestAuditService } from '../../services/latest-audit.service';
import { FailedImagesService } from '../../services/failed-images.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-status',
  standalone: true,
  imports: [MatButtonModule, RouterLink, navbarComponent, CommonModule],
  templateUrl: './status.component.html',
  styleUrl: './status.component.scss'
})
export class StatusComponent implements OnInit {
  latestAudit: Audit | undefined;
  failedImages: Images[] | undefined;
  imageLoaded: boolean = true;
  // Set up later to parse JWT token for dealershipID
  dealershipID: number = 7;

  constructor(private latestAuditService: LatestAuditService, private failedImagesService: FailedImagesService) { }

  ngOnInit(): void {
    this.loadLatestAudit();
  }

  loadLatestAudit() {
    this.latestAuditService.getLatestAuditForDealership(this.dealershipID).subscribe(
      (latestAudit) => {
        this.latestAudit = latestAudit;
        if (this.latestAudit.finalVerdict === 'Failed') {
          this.loadFailedImages(this.latestAudit.id);
        }
      },
      (error) => {
        // Log any errors that occur during the HTTP request
        console.error('Error fetching latest audit:', error);
      }
    );
  }

  loadFailedImages(auditId: number) {
    this.failedImagesService.getFailedImagesForAudit(auditId).subscribe(failedImages => {
      this.failedImages = failedImages;
      console.log('Failed Images:', failedImages); 
    });
  }

  getImageUrl(fileName: string): string {
    return `http://localhost:3000/assets/${fileName}`;
  }

  displayFileName(fileName: string) {
    this.imageLoaded = false;
  }
}