import { Component, OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { FormsModule } from '@angular/forms';
import { MarkdownModule } from 'ngx-markdown';
import { AuditorNavbarComponent } from '../auditor-navbar/auditor-navbar.component';
import { CriteriaService } from '../../services/criteria.service';
import { MatTooltipModule } from '@angular/material/tooltip';
import { Criterion } from '../../interfaces/criterion';
import { MatListModule } from '@angular/material/list';
import { RouterModule } from '@angular/router';
import { ImageModalComponent } from '../image-modal/image-modal.component';
import { ActivatedRoute } from '@angular/router';
import { CampaignService } from '../../services/campaign.service';

@Component({
  selector: 'app-edit-audit-submission-guidelines',
  standalone: true,
  imports: [
    MatIconModule,
    MatCardModule,
    CommonModule,
    MatButtonModule,
    FormsModule,
    MarkdownModule,
    AuditorNavbarComponent,
    MatTooltipModule,
    MatListModule,
    RouterModule,
    ImageModalComponent,
  ],
  templateUrl: './edit-audit-submission-guidelines.component.html',
  styleUrls: ['./edit-audit-submission-guidelines.component.scss'],
})
export class EditAuditSubmissionGuidelinesComponent implements OnInit {
  criteria: Criterion[] = [];
  campaignID: number | undefined;
  backupCriteria: { [id: number]: Criterion } = {};
  selectedFiles: { [id: number]: File[] } = {};
  selectedFileUrls: { [id: number]: string[] } = [];
  modalImageUrl: string | null = null;

  constructor(
    private campaignService: CampaignService,
    private criteriaService: CriteriaService,
    private toastr: ToastrService,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    // Subscribe to route parameter changes to get the campaignID from the URL
    this.route.params.subscribe((params) => {
      this.campaignID = +params['campaignID']; // Convert string to number
      this.loadCriteria(); // Call the method to load criteria after getting campaignID
    });
  }

  loadCriteria(): void {
    if (!this.campaignID) {
      return;
    }
    this.campaignService.getCampaign(this.campaignID).subscribe(
      (campaign) => {
        this.criteria = campaign.criteria;
        // Creates a criteria if no criteria in campaign
        if (this.criteria.length === 0) {
          this.createNewCriterion();
        }
      }
    );
  }

  createNewCriterion(): void {
    const createCriteriaDto = {
      campaignID: this.campaignID,
    };

    this.criteriaService.createCriterion(createCriteriaDto).subscribe(
      (newCriterion: Criterion) => {
        newCriterion.editMode = true; // New criteria starts in edit mode
        this.criteria.push(newCriterion);
        this.toastr.success('Criterion created successfully!', 'Success');
      },
      (error) => {
        console.error('Error creating criterion:', error);
        this.toastr.error('Failed to create criterion!', 'Error');
      }
    );
  }

  editCriterion(criterion: Criterion): void {
    this.backupCriteria[criterion.criteriaID] = { ...criterion };
    criterion.editMode = true;
    // Initialize selected files array for the criterion if not already selected
    if (!this.selectedFiles[criterion.criteriaID]) {
      this.selectedFiles[criterion.criteriaID] = [];
    }
    // If the criterion has a filename, set the selected file URL to display the image in edit mode
    if (criterion.filename) {
      this.selectedFileUrls[criterion.criteriaID] = [
        `http://localhost:3000/posters/${criterion.filename}`,
      ];
    }
  }

  cancelEdit(criterion: Criterion): void {
    const backupCriterion = this.backupCriteria[criterion.criteriaID];
    if (backupCriterion) {
      Object.assign(criterion, backupCriterion);
      delete this.backupCriteria[criterion.criteriaID];
    }
    criterion.editMode = false;
    // Reset selected files for the criterion
    this.selectedFiles[criterion.criteriaID] = [];
    this.selectedFileUrls[criterion.criteriaID] = [];
  }

  saveCriterion(criterion: Criterion): void {
    const selectedFiles = this.selectedFiles[criterion.criteriaID];
    const criterionID = criterion.criteriaID; // Get the criterion ID

    // Check if an image has been selected for the current criterion or filename exists
    if ((!selectedFiles || selectedFiles.length === 0) && !criterion.filename) {
      this.toastr.error(`Failed to save criterion: "${criterion.name}"! Please select an image.`, 'Error');
      return;
    }
    this.criteriaService
      .updateCriterion(criterionID, criterion, selectedFiles)
      .subscribe(
        () => {
          const index = this.criteria.findIndex(
            (c) => c.criteriaID === criterion.criteriaID
          );
          if (index !== -1) {
            if (!this.campaignID) {
              this.toastr.error(`Failed to save criterion: "${criterion.name}"!`, 'Error');
              return;
            }
            // Load saved criteria so that changed image displays
            this.campaignService.getCampaign(this.campaignID).subscribe(
              (campaign) => {
                const updatedCriterion = campaign.criteria.find(
                  (c: Criterion) => c.criteriaID === criterionID
                );
                if (updatedCriterion) {
                  this.criteria[index] = updatedCriterion;
                  this.criteria[index].editMode = false;
                  this.toastr.success(`Criterion: "${criterion.name}" saved successfully!`,'Success');
                } else {
                  console.error('Error: Updated criterion not found');
                  this.toastr.error(`Failed to save criterion: "${criterion.name}"!`, 'Error');
                }
              },
              (error) => {
                console.error('Error loading campaign:', error);
                this.toastr.error(`Failed to save criterion: "${criterion.name}"!` , 'Error');
              }
            );
          }
        },
        (error) => {
          if (error.status === 500) {
            // Error for if data would be truncated in table
            this.toastr.error(
              `Failed to save criterion: "${criterion.name}"! Exceeded character limit in guidelines`, 'Error'
            );
          } else {
            console.error('Error saving criterion:', error);
            this.toastr.error(`Failed to save criterion: "${criterion.name}"!`, 'Error');
          }
        }
      );
  }

  deleteCriterion(criterion: Criterion): void {
    // Error for if only 1 criteria left
    if (this.criteria.length === 1) {
      this.toastr.error(
        `Failed to delete criterion: "${criterion.name}"!
         There needs to be at least one criteria for a campaign.`, 'Error'
        );
      return;
    }
    this.criteriaService.deleteCriterion(criterion.criteriaID).subscribe(
      () => {
        const index = this.criteria.indexOf(criterion);
        if (index !== -1) {
          this.criteria.splice(index, 1);
          this.toastr.success(`Criterion: "${criterion.name}" deleted successfully!`, 'Success');
        }
      },
      // Error for if criteria referenced in submitted evidenec
      (error) => {
        if (error.status === 500) {
          this.toastr.error(
            `Failed to delete criterion: "${criterion.name}"!
           Criterion is referenced in submitted evidence.`, 'Error'
          );
        } else {
          console.error('Error deleting criterion:', error);
          this.toastr.error(`Failed to delete criterion: "${criterion.name}"!`, 'Error');
        }
      }
    );
  }

  openFileInput(criterion: Criterion): void {
    const fileInput = document.getElementById(
      `fileInput-${criterion.criteriaID}`
    ) as HTMLInputElement;
    if (fileInput) {
      fileInput.click();
    }
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

  deleteImage(criterion: Criterion): void {
    // Remove the selected file, its URL, and the filename
    delete this.selectedFiles[criterion.criteriaID];
    delete this.selectedFileUrls[criterion.criteriaID];
    criterion.filename = ''; // Clear the filename by assigning an empty string
  }

  handleInputTitle(event: any, criterion: Criterion): void {
    const maxLength = 40; // Character limit to prevent titles from being too long
    const inputLength = event.target.value.length;
    if (inputLength > maxLength) {
      // Truncate the input value
      event.target.value = event.target.value.slice(0, maxLength);
      // Display toaster message for exceeding the character limit
      this.toastr.error(`Maximum character limit reached for criterion: "${criterion.name}"!`, 'Error');
    }
  }

  handleInputGuidelines(event: any, criterion: Criterion): void {
    const maxLength = 900; // Character limit to prevent guidelines from being too long
    const inputLength = event.target.value.length;
    if (inputLength > maxLength) {
      // Truncate the input value
      event.target.value = event.target.value.slice(0, maxLength);
      // Display toaster message for exceeding the character limit
      this.toastr.error(`Maximum character limit reached for criterion: "${criterion.name}"!`, 'Error');
    }
  }

  openModal(imageUrl: string): void {
    this.modalImageUrl = imageUrl;
  }

  closeModal(): void {
    this.modalImageUrl = null;
  }
}
