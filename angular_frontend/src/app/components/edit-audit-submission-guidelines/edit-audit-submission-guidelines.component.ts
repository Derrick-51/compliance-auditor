import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
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
import { FormGroup, FormBuilder } from '@angular/forms'
import { ImageModalComponent } from '../image-modal/image-modal.component';

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
  styleUrls: ['./edit-audit-submission-guidelines.component.scss']
})
export class EditAuditSubmissionGuidelinesComponent implements OnInit {
  criteria: Criterion[] = [];
  campaignID = 1;
  backupCriteria: { [id: number]: Criterion } = {};
  criteriaForm: FormGroup;
  selectedFiles: { [id: number]: File[] } = {};
  selectedFileUrls: { [id: number]: string[] } = [];
  modalImageUrl: string | null = null;

  constructor(
    private criteriaService: CriteriaService,
    private toastr: ToastrService,
    private fb: FormBuilder,
  ) {
    this.criteriaForm = this.fb.group({
      image: ['']
    });
  }

  ngOnInit(): void {
    this.loadCriteria();
  }

  loadCriteria(): void {
    this.criteriaService.getCriteriaByCampaignID(this.campaignID).subscribe(
      (criteria: Criterion[]) => {
        this.criteria = criteria;
      },
      (error) => {
        console.error('Error loading criteria:', error);
      }
    );
  }

  createNewCriterion(): void {
    const createCriteriaDto = {
      campaignID: this.campaignID
    };

    this.criteriaService.createCriterion(createCriteriaDto).subscribe(
      (newCriterion: Criterion) => {
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
      this.selectedFileUrls[criterion.criteriaID] = [`http://localhost:3000/posters/${criterion.filename}`];
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
    const criterionId = criterion.criteriaID; // Get the criterion ID
    this.criteriaService.updateCriterion(criterionId, criterion, selectedFiles).subscribe(
      () => {
        const index = this.criteria.findIndex(c => c.criteriaID === criterion.criteriaID);
        if (index !== -1) {
          this.criteriaService.getCriteriaByCampaignID(this.campaignID).subscribe(
            (criteria: Criterion[]) => {
              this.criteria[index].filename = criteria[index].filename;
            },
            (error) => {
              console.error('Error loading criteria:', error);
            }
          );
          this.criteria[index].editMode = false;
          this.toastr.success('Criterion saved successfully!', 'Success');
        }
      },
      (error) => {
        console.error('Error saving criterion:', error);
        this.toastr.error('Failed to save criterion!', 'Error');
      }
    );
  }

  saveAllCriteria(): void {
    // Iterate through all criteria
    this.criteria.forEach(criterion => {
      // Check if the criterion is in edit mode
      if (criterion.editMode) {
        // Call the saveCriterion function for the criterion in edit mode
        this.saveCriterion(criterion);
      }
    });
  }

  deleteCriterion(criterion: Criterion): void {
    this.criteriaService.deleteCriterion(criterion.criteriaID).subscribe(
      () => {
        const index = this.criteria.indexOf(criterion);
        if (index !== -1) {
          this.criteria.splice(index, 1);
          this.toastr.success('Criterion deleted successfully!', 'Success');
        }
      },
      (error) => {
        console.error('Error deleting criterion:', error);
        this.toastr.error('Failed to delete criterion!', 'Error');
      }
    );
  }
  
  openFileInput(criterion: Criterion): void {
    const fileInput = document.getElementById(`fileInput-${criterion.criteriaID}`) as HTMLInputElement;
    if (fileInput) {
      fileInput.click();
    }
  }
  
  onFileSelected(event: any, criterion: Criterion): void {
    const files: FileList = event.target.files;
    if (files) {
      const selectedFiles: File[] = [];
      const selectedFileUrls: string[] = [];
  
      const reader = new FileReader();
  
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        selectedFiles.push(file); // Store the file
  
        reader.onload = (e: any) => {
          const url = e.target.result;
          selectedFileUrls.push(url); // Store the URL associated with the file
        };
  
        reader.readAsDataURL(file);
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

  openModal(imageUrl: string): void {
    this.modalImageUrl = imageUrl;
  }

  closeModal(): void {
    this.modalImageUrl = null;
  }
}