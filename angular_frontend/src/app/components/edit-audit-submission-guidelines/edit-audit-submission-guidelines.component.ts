import { Component, OnInit } from '@angular/core';
import { SaveGuidelinesService } from '../../services/save-guidelines.service';
import { ReadGuidelinesService } from '../../services/read-guidelines.service';
import { ToastrService } from 'ngx-toastr';
import { Criterion } from '../../interfaces/criterion';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { FormsModule } from '@angular/forms';
import { MarkdownModule } from 'ngx-markdown';
import { AuditorNavbarComponent } from '../auditor-navbar/auditor-navbar.component';

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
    AuditorNavbarComponent
  ],
  templateUrl: './edit-audit-submission-guidelines.component.html',
  styleUrls: ['./edit-audit-submission-guidelines.component.scss']
})
export class EditAuditSubmissionGuidelinesComponent implements OnInit {
  criteria: Criterion[] = [];
  newCriterion: Criterion = {
    name: 'Criteria Title',
    filename: '',
    guidelines: 'Enter guidelines for criteria submission here. This will be displayed for the dealership submitting an audit.'
  };

  constructor(
    private saveGuidelinesService: SaveGuidelinesService,
    private readGuidelinesService: ReadGuidelinesService,
    private toastr: ToastrService
  ) { }

  ngOnInit(): void {
    this.loadCriteria();
  }

  loadCriteria(): void {
    // Call a service method to fetch existing criteria with CampaignID equal to the CampaignID variable
    // Assign the fetched criteria to this.criteria
    // Example:
    // this.criteriaService.getCriteriaByCampaignID(campaignID).subscribe(criteria => this.criteria = criteria);
  }

  saveCriterion(criterion: Criterion): void {
    // Call a service method to save the criterion
    // Example:
    // this.criteriaService.saveCriterion(criterion).subscribe(() => {
    //   this.toastr.success('Criterion saved successfully.');
    // });
  }

  addNewCriterion(): void {
    // Call a service method to create a new criterion with CampaignID equal to the CampaignID variable
    // Example:
    // this.criteriaService.createCriterion(this.newCriterion).subscribe(newCriterion => {
    //   this.criteria.push(newCriterion);
    //   this.toastr.success('New criterion added successfully.');
    // });
  }

  cancelEdit(criterion: Criterion): void {
    // Remove the criterion from the criteria array or reset its state
    // Example:
    // this.criteria = this.criteria.filter(c => c !== criterion);
    // Or, reset its state back to preview mode
    // criterion.editMode = false;
  }

  saveAllCriteria(): void {
    // Call a service method to save all criteria
    // Example:
    // this.criteriaService.saveAllCriteria(this.criteria).subscribe(() => {
    //   this.toastr.success('All criteria saved successfully.');
    // });
  }
}