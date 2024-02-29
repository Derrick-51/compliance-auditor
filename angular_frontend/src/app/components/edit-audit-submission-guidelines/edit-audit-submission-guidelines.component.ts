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
  editorContent: string = '';
  previewContent: string = '';

  // Path to Markdown file with guidelines
  markdownFilePath: string = '/assets/audit-submission-guidelines.md';

    // Inject markdown file services
  constructor(private markdownService: MarkdownFileService) { }

  ngOnInit(): void {
    this.markdownService.readMarkdownFile(this.markdownFilePath)
    .subscribe((markdownContent: string) => {
     this.editorContent = markdownContent;
     this.updatePreview();
    });
  }

  updatePreview() {
    this.previewContent = this.editorContent;
  }
}
