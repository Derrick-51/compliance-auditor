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
  ],
  templateUrl: './edit-audit-submission-guidelines.component.html',
  styleUrls: ['./edit-audit-submission-guidelines.component.scss']
})
export class EditAuditSubmissionGuidelinesComponent implements OnInit {
  criteria: Criterion[] = [];
  campaignID = 1;

  constructor(
    private criteriaService: CriteriaService,
    private toastr: ToastrService
  ) { }

  ngOnInit(): void {
    this.loadCriteria();
  }

  loadCriteria(): void {
    this.criteriaService.getCriteriaByCampaignID(this.campaignID).subscribe(
      (data: Criterion[]) => { // Expect data to be an array of Criterion objects
        this.criteria = data;
      },
      (error) => {
        console.error('Error loading criteria:', error);
      }
    );
  }

  addNewCriterion(): void {
    const newCriterion: Criterion = { id: 0, name: 'New Criterion', guidelines: '', filename: '', editMode: true };
    this.criteria.push(newCriterion);
  }

  editCriterion(criterion: Criterion): void {
    criterion.editMode = true;
  }

  cancelEdit(criterion: Criterion): void {
    criterion.editMode = false;
  }

  saveCriterion(criterion: Criterion): void {
    this.criteriaService.updateCriterion(criterion).subscribe(
      () => {
        criterion.editMode = false;
        this.toastr.success('Criterion saved successfully!', 'Success');
      },
      (error) => {
        console.error('Error saving criterion:', error);
        this.toastr.error('Failed to save criterion!', 'Error');
      }
    );
  }

  saveAllCriteria(): void {
    this.criteriaService.updateAllCriteria(this.criteria).subscribe(
      () => {
        this.toastr.success('All criteria saved successfully!', 'Success');
      },
      (error) => {
        console.error('Error saving all criteria:', error);
        this.toastr.error('Failed to save all criteria!', 'Error');
      }
    );
  }
  
  selectImage(criterion: any): void {
    // Implement image selection logic here
  }
}