import { Router, RouterLink } from '@angular/router';
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
import { ImageService } from '../../services/image.service';
import { AuditService } from '../../services/audit.service';
import { CampaignService } from '../../services/campaign.service';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-make-an-audit',
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
  templateUrl: './make-an-audit.component.html',
  styleUrl: './make-an-audit.component.scss',
})
export class MakeAnAuditComponent implements OnInit {
  criteria: Criterion[] = [];
  selectedFiles: { [id: number]: File[] } = {};
  selectedFileUrls: { [id: number]: string[] } = [];
  userEmail: string | undefined;
  campaignID: number | undefined;
  modalImageUrl: string | null = null;

  constructor(
    private toastr: ToastrService,
    private imageService: ImageService,
    private auditService: AuditService,
    private campaignService: CampaignService,
    private http: HttpClient,
    private router: Router
  ) {}

  ngOnInit(): void {
    // Set the user email on initialization
    this.http
      .get<any>('http://localhost:3000/auth/profile', {
        withCredentials: true,
      })
      .subscribe(
        (user) => {
          this.userEmail = user.email;
          // Load Criteria
          this.loadCriteria();
        }
      );
  }

  loadCriteria(): void {
    // Sets campaignID to latest
    this.campaignService.getLatestCampaign().subscribe(
      (latestCampaign) => {
        this.campaignID = latestCampaign.campaignID;
        if (!this.campaignID) {
          this.toastr.error('Failed to load criteria!', 'Error');
          return;
        }
        // Loads criteria
        this.campaignService.getCampaign(this.campaignID).subscribe(
          (campaign) => {
            this.criteria = campaign.criteria;
          },
          (error) => {
            console.error('Error loading criteria:', error);
            this.toastr.error('Failed to load criteria!', 'Error');
          }
        );
      },
      (error) => {
        this.toastr.error('Failed to load criteria!', 'Error');
        console.error('Error loading campaign ID:', error);
      }
    );
  }

  submitAudit(): void {
    if (!this.userEmail || !this.campaignID) {
      console.error('User Email or campaign ID null');
      this.toastr.error('Failed to submit audit!', 'Error');
      return;
    }
  
    let totalImagesToUpload = 0;
  
    // Check if all criteria have images selected and count total images
    for (const criterion of this.criteria) {
      if (!this.selectedFiles[criterion.criteriaID] || this.selectedFiles[criterion.criteriaID].length === 0) {
        this.toastr.error(
          `Failed to submit audit! Please select an image for criterion: "${criterion.name}"`, 'Error'
        );
        return;
      } else {
        totalImagesToUpload += this.selectedFiles[criterion.criteriaID].length;
      }
    }
  
    // Create an Audit and get AuditID
    this.auditService.createAudit(this.userEmail, this.campaignID).subscribe(
      (audit) => {
        const auditID = audit.auditID;
        let uploadedImagesCount = 0; // Initialize the count of uploaded images
        // Iterate through all criteria
        this.criteria.forEach((criterion) => {
          const criterionID = criterion.criteriaID;
          const selectedFiles = this.selectedFiles[criterionID];
          selectedFiles.forEach((file) => {
            this.imageService.createImage(auditID, criterionID, file).subscribe(
              () => {
                uploadedImagesCount++;
                // Check if all images have been uploaded
                if (uploadedImagesCount === totalImagesToUpload) {
                  this.toastr.success('Audit submitted successfully!', 'Success');
                  this.router.navigate(['status']);
                }
              },
              (error) => {
                console.error('Error creating image:', error);
                this.toastr.error(
                  `Failed to submit image for criterion: "${criterion.name}"!`, 'Error'
                );
              }
            );
          });
        });
      },
      (error) => {
        console.error('Error creating audit:', error);
        this.toastr.error('Failed to submit audit!', 'Error');
      }
    );
  }

  deleteImage(criterion: Criterion): void {
    // Remove the selected file and its URL
    delete this.selectedFiles[criterion.criteriaID];
    delete this.selectedFileUrls[criterion.criteriaID];
  }

  onFileSelected(event: any, criterion: Criterion): void {
    const files: FileList = event.target.files;
    if (files) {
      const selectedFiles: File[] = [];
      const selectedFileUrls: string[] = [];

      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        const extension = file.name.split('.').pop()?.toLowerCase(); // Get the file extension

        // Check if the file extension is valid
        if (extension && ['png', 'jpg', 'jpeg'].includes(extension)) {
          selectedFiles.push(file); // Store the file
          const reader = new FileReader();

          reader.onload = (e: any) => {
            const url = e.target.result;
            selectedFileUrls.push(url); // Store the URL associated with the file
          };

          reader.readAsDataURL(file);
        } else {
          // Display toaster message for invalid file type
          this.toastr.error(
            `Invalid file type selected for criterion: "${criterion.name}"! 
            Please only select PNG or JPG files.`, 'Error'
          );
        }
      }

      this.selectedFiles[criterion.criteriaID] = selectedFiles;
      this.selectedFileUrls[criterion.criteriaID] = selectedFileUrls;
    }
  }

  openFileInput(criterion: Criterion): void {
    const fileInput = document.getElementById(
      `fileInput-${criterion.criteriaID}`
    ) as HTMLInputElement;
    if (fileInput) {
      fileInput.click();
    }
  }

  openModal(imageUrl: string): void {
    this.modalImageUrl = imageUrl;
  }

  closeModal(): void {
    this.modalImageUrl = null;
  }
}
