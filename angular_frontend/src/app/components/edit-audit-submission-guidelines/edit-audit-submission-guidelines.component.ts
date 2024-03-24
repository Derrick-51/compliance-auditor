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
import { ActivatedRoute } from '@angular/router';
import { FormGroup, FormBuilder } from '@angular/forms'
import { FileUploadService } from '../../services/file-upload.service';
import { HttpEventType } from '@angular/common/http';

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
  ],
  templateUrl: './edit-audit-submission-guidelines.component.html',
  styleUrls: ['./edit-audit-submission-guidelines.component.scss']
})
export class EditAuditSubmissionGuidelinesComponent implements OnInit {
  criteria: Criterion[] = [];
  campaignID = 1;
  backupCriteria: { [id: number]: Criterion } = {};
  criteriaForm: FormGroup;
  selectedFile: File | null = null;

  constructor(
    private criteriaService: CriteriaService,
    private toastr: ToastrService,
    private fb: FormBuilder,
    private uploadService: FileUploadService,
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
      (data: Criterion[]) => {
        this.criteria = data;
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
  }

  cancelEdit(criterion: Criterion): void {
    const backupCriterion = this.backupCriteria[criterion.criteriaID];
    if (backupCriterion) {
      Object.assign(criterion, backupCriterion);
      delete this.backupCriteria[criterion.criteriaID];
    }
    criterion.editMode = false;
  }

  saveCriterion(criterion: Criterion): void {
    if (this.selectedFile) {
      this.uploadService.upload(this.selectedFile, 'posters').subscribe({
        next: (event) => {
          if (event.type === HttpEventType.UploadProgress) {
            // Handle progress event
          } else if (event.type === HttpEventType.Response) {
            criterion.filename = event.body.filename;
            this.updateCriterion(criterion);
          }
        },
        error: (error) => {
          console.error('Error uploading image:', error);
          this.toastr.error('Failed to upload image!', 'Error');
        }
      });
    } else {
      this.updateCriterion(criterion);
    }
  }

  private updateCriterion(criterion: Criterion): void {
    this.criteriaService.updateCriterion(criterion).subscribe(
      () => {
        const index = this.criteria.findIndex(c => c.criteriaID === criterion.criteriaID);
        if (index !== -1) {
          this.criteria[index] = criterion;
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
    const criteriaToUpdate = this.criteria.map(criterion => {
      return {
        criteriaID: criterion.criteriaID,
        name: criterion.name,
        guidelines: criterion.guidelines,
        filename: criterion.filename
      };
    });
  
    this.criteriaService.updateAllCriteria(criteriaToUpdate).subscribe(
      () => {
        this.criteria.forEach(criterion => criterion.editMode = false);
        this.toastr.success('All criteria saved successfully!', 'Success');
      },
      (error) => {
        console.error('Error saving all criteria:', error);
        this.toastr.error('Failed to save all criteria!', 'Error');
      }
    );
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
  
  openFileInput(): void {
    const fileInput = document.getElementById('fileInput');
    if (fileInput) {
      fileInput.click();
    }
  }
  
  onFileSelected(event: any, criterion: Criterion): void {
    const file: File = event.target.files[0];
    this.selectedFile = file;
  
    const reader = new FileReader();
    reader.onload = () => {
      criterion.filename = reader.result as string; // Update filename with the selected image
    };
    reader.readAsDataURL(file);
  }
}
