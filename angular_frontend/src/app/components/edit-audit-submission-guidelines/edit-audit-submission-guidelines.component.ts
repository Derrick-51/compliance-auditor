import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MarkdownFileService } from '../../services/markdown-file.service';
import { MatButtonModule } from '@angular/material/button';
import { FormsModule } from '@angular/forms';
import { MarkdownModule } from 'ngx-markdown';

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
  constructor(private markdownFileService: MarkdownFileService) { }

  ngOnInit(): void {
    this.markdownFileService.readMarkdownFile().subscribe((markdownContent: string) => {
     this.guidelines = markdownContent;
    });
  }
}
