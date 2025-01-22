import { RouterLink } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { navbarComponent } from '../navbar/navbar.component';
import { MarkdownModule } from 'ngx-markdown';
import { ImageModalComponent } from '../image-modal/image-modal.component';
import { MatTooltipModule } from '@angular/material/tooltip';
import { ToastrService } from 'ngx-toastr';
import { Criterion } from '../../interfaces/criterion';
import { AuditService } from '../../services/audit.service';
import { CampaignService } from '../../services/campaign.service';
import { HttpClient } from '@angular/common/http';
import { Images } from '../review-audit/audit-list';
import { OverrideService } from '../../services/override.service';

@Component({
  selector: 'app-status',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    MatButtonModule,
    MatCardModule,
    MatIconModule,
    navbarComponent,
    MarkdownModule,
    ImageModalComponent,
    MatTooltipModule,
  ],
  templateUrl: './status.component.html',
  styleUrl: './status.component.scss',
})
export class StatusComponent implements OnInit {
  criteria: Criterion[] = [];
  selectedFiles: { [id: number]: File[] } = {};
  selectedFileUrls: { [id: number]: string[] } = [];
  userID: number | undefined;
  campaignID: number | undefined;
  modalImageUrl: string | null = null;
  auditID: number | undefined;
  finalVerdict: string | undefined;
  submitDate: string | undefined;
  update: string | undefined;
  images: Images[] = [];

  constructor(
    private toastr: ToastrService,
    private overrideService: OverrideService,
    private auditService: AuditService,
    private campaignService: CampaignService,
    private http: HttpClient
  ) {}

  ngOnInit(): void {
    // Set the user ID on initialization
    this.http
      .get<any>('http://localhost:3000/auth/profile', {
        withCredentials: true,
      })
      .subscribe(
        (user) => {
          this.userID = user.id;
          // Loads Audit
          this.loadAudit();
        }
      );
  }

  loadAudit(): void {
    // Sets campaignID to latest
    this.campaignService.getLatestCampaign().subscribe(
      (latestCampaign) => {
        this.campaignID = latestCampaign.campaignID;
        if (!this.campaignID || !this.userID) {
          this.toastr.error('Failed to load audit!', 'Error');
          return;
        }
        // Loads Audit
        this.auditService
          .getAuditByUserAndCampaign(this.userID, this.campaignID)
          .subscribe(
            (audit) => {
              // No audit is found
              if(!audit) {
                return;
              }
              this.auditID = audit.auditID;
              this.finalVerdict = audit.finalVerdict;
              this.submitDate = new Date(audit.submitDate).toLocaleString();
              this.update = new Date(audit.update).toLocaleString();
              if (!this.auditID) {
                this.toastr.error('Failed to load audit!', 'Error');
                return;
              }

              // Loads Images
              this.overrideService.getImages(this.auditID).subscribe(
                (images) => {
                  // Sort images by criterion ID
                  this.images = images.sort((a, b) =>
                     Number(a.criterion.criteriaID) - Number(b.criterion.criteriaID));
                },
                (error) => {
                  console.error('Error retrieving images:', error);
                  this.toastr.error('Failed to load audit!', 'Error');
                }
              );
            },
            (error) => {
              this.toastr.error('Failed to load audit!', 'Error');
              console.error('Error loading audit:', error);
            }
          );
      },
      (error) => {
        this.toastr.error('Failed to load audit!', 'Error');
        console.error('Error retrieving campaign ID:', error);
      }
    );
  }

  openModal(imageUrl: string): void {
    this.modalImageUrl = imageUrl;
  }

  closeModal(): void {
    this.modalImageUrl = null;
  }
}
