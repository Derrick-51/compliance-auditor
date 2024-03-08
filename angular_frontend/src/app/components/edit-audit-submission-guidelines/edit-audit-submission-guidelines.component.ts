import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReadGuidelinesService } from '../../services/read-guidelines.service';
import { MatButtonModule } from '@angular/material/button';
import { FormsModule } from '@angular/forms';
import { MarkdownModule } from 'ngx-markdown';
import { SaveGuidelinesService } from '../../services/save-guidelines.service';
import { AuditorNavbarComponent } from '../auditor-navbar/auditor-navbar.component';
import { ToastrService } from 'ngx-toastr'

@Component({
  selector: 'app-edit-audit-submission-guidelines',
  standalone: true,
  imports: [MatButtonModule, CommonModule, FormsModule, MarkdownModule, AuditorNavbarComponent],
  templateUrl: './edit-audit-submission-guidelines.component.html',
  styleUrl: './edit-audit-submission-guidelines.component.scss'
})
export class EditAuditSubmissionGuidelinesComponent implements OnInit {
  guidelines: string = '';

  // Inject guideline file services
  constructor (
    private readGuidelinesService: ReadGuidelinesService,
    private saveGuidelinesService: SaveGuidelinesService,
    private toastr: ToastrService, //create toast constructor
) { }

  ngOnInit(): void {
    this.readGuidelinesService.readGuidelines().subscribe((markdownContent: string) => {
      this.guidelines = markdownContent;
    });
  }

  // Submit button click handler
  saveGuidelines(): void {
    this.saveGuidelinesService.save(this.guidelines).subscribe(() => {
      this.toastr.success("The changes to the audit guidelines have been saved!", "Successfully Changed!")
      console.log('Guidelines saved successfully.');
    }, (error) => {
      this.toastr.error('An error has occured trying to save the audit guidelines!', 'Change Unsuccessful!');
      console.error('Error saving guidelines:', error);
    });
  }
}
