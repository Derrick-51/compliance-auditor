import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReadGuidelinesService } from '../../services/read-guidelines.service';
import { MatButtonModule } from '@angular/material/button';
import { FormsModule } from '@angular/forms';
import { MarkdownModule } from 'ngx-markdown';
import { SaveGuidelinesService } from '../../services/save-guidelines.service';

@Component({
  selector: 'app-edit-audit-submission-guidelines',
  standalone: true,
  imports: [MatButtonModule, CommonModule, FormsModule, MarkdownModule],
  templateUrl: './edit-audit-submission-guidelines.component.html',
  styleUrl: './edit-audit-submission-guidelines.component.scss'
})
export class EditAuditSubmissionGuidelinesComponent implements OnInit {
  guidelines: string = '';

  // Inject markdown file services
  constructor(private readGuidelinesService: ReadGuidelinesService, private saveGuidelinesService: SaveGuidelinesService) { }

  ngOnInit(): void {
    this.readGuidelinesService.readGuidelines().subscribe((markdownContent: string) => {
     this.guidelines = markdownContent;
    });
  }

  // Submit button click handler
  saveGuidelines(): void {
    this.saveGuidelinesService.save(this.guidelines).subscribe(() => {
      console.log('Guidelines saved successfully.');
    }, (error) => {
      console.error('Error saving guidelines:', error);
    });
  }
}
