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
  criterionId: number | undefined;

  constructor(
    private criteriaService: CriteriaService,
    private toastr: ToastrService,
    private route: ActivatedRoute,
  ) { }

  ngOnInit(): void {
    this.loadCriteria();
    this.route.params.subscribe(params => {
      this.criterionId = params['id']; // Retrieve criterion ID from route parameters
      // Load matcard based on criterion ID
    });
  }

  loadCriteria(): void {
    this.criteriaService.getCriteriaByCampaignID(this.campaignID).subscribe(
      (data: Criterion[]) => { // Expect data to be an array of Criterion objects
        this.criteria = data;
        console.log('Criteria loaded:', this.criteria); // Log loaded criteria
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
        // Handle the newly created criterion
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
    console.log('Criterion ID:', criterion.criteriaID);
    this.backupCriteria[criterion.criteriaID] = { ...criterion }; // Store backup state for the criterion
    criterion.editMode = true;
  }

  cancelEdit(criterion: Criterion): void {
    const backupCriterion = this.backupCriteria[criterion.criteriaID];
    if (backupCriterion) {
      Object.assign(criterion, backupCriterion); // Restore the criterion to its backup state
      delete this.backupCriteria[criterion.criteriaID]; // Remove the backup state entry
    }
    criterion.editMode = false;
  }

  saveCriterion(criterion: Criterion): void {
    console.log('Criterion to be saved:', criterion); // Log criterion to be saved
      this.criteriaService.updateCriterion(criterion).subscribe(
        (updatedCriterion: Criterion) => {
          // Update the criterion in the criteria array
          const index = this.criteria.findIndex(c => c.criteriaID === updatedCriterion.criteriaID);
          if (index !== -1) {
            this.criteria[index] = updatedCriterion;
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
      // Extract only the necessary fields for updating
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
  
  selectImage(criterion: any): void {
    // Implement image selection logic here
  }
}
