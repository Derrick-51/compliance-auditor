import { Component, OnInit } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { RouterLink } from '@angular/router';
import { navbarComponent } from '../navbar/navbar.component';
import { Audit } from '../../interfaces/audit-status';
import { Images } from '../../interfaces/images';
import { LatestAuditService } from '../../services/latest-audit.service';
import { FailedImagesService } from '../../services/failed-images.service';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { ImageModalComponent } from '../image-modal/image-modal.component';

@Component({
  selector: 'app-status',
  standalone: true,
  imports: [MatButtonModule, RouterLink, navbarComponent, CommonModule, ImageModalComponent],
  templateUrl: './status.component.html',
  styleUrl: './status.component.scss'
})
export class StatusComponent implements OnInit {
  latestAudit: Audit | undefined;
  failedImages: Images[] | undefined;
  imageLoaded: boolean = true;
  dealershipId: number | undefined;
  modalImageUrl: string | null = null;

  constructor(
    private latestAuditService: LatestAuditService,
    private failedImagesService: FailedImagesService,
    private http: HttpClient
  ) {}

  ngOnInit(): void {
    this.http.get<any>('http://localhost:3000/auth/profile', {
      withCredentials: true
    }).subscribe((data) => {
      this.dealershipId = data.id;
      this.loadLatestAudit();
    }, (error) => {
      console.error('Error fetching user data:', error);
    });
  }

  loadLatestAudit() {
    if (!this.dealershipId)
     return;
    this.latestAuditService.getLatestAuditForDealership(this.dealershipId).subscribe((latestAudit) => {
      this.latestAudit = latestAudit;
      if(!this.latestAudit)
        return;
      if (this.latestAudit.finalVerdict === 'Failed')
        this.loadFailedImages(this.latestAudit.id);
    });
  }

  loadFailedImages(auditId: number) {
    this.failedImagesService.getFailedImagesForAudit(auditId).subscribe(failedImages => {
      this.failedImages = failedImages;
    });
  }

  getImageUrl(fileName: string): string {
    if (!fileName)
     return '';
    return `http://localhost:3000/images/${fileName}`;
  }

  displayFileName(fileName: string) {
    this.imageLoaded = false;
  }

  openModal(imageUrl: string): void {
    this.modalImageUrl = imageUrl;
  }
  
  closeModal(): void {
    this.modalImageUrl = null;
  }
}