import { Component, OnInit } from '@angular/core';
import { MarkdownFileService } from '../../services/markdown-file.service';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { FormsModule } from '@angular/forms';
import * as marked from 'marked';

@Component({
  selector: 'app-edit-audit-submission-guidelines',
  standalone: true,
  imports: [MatFormFieldModule, MatInputModule, MatButtonModule, FormsModule],
  templateUrl: './edit-audit-submission-guidelines.component.html',
  styleUrl: './edit-audit-submission-guidelines.component.scss'
})
export class EditAuditSubmissionGuidelinesComponent implements OnInit {
  guidelines: string = '';
  editedGuidelines: string = '';

  // Path to Markdown file with guidelines
  markdownFilePath: string = '../../../../angular_frontend/audit-submission-guidelines.md';

  // Inject markdown file service
  constructor(private markdownService: MarkdownFileService) { }

  // Read Markdown file and initialize guidelines with its content when page is loaded
  ngOnInit(): void {
    this.markdownService.readMarkdownFile(this.markdownFilePath)
      .subscribe(async (markdownContent: string) => {
        this.guidelines = markdownContent;
        this.editedGuidelines = await this.renderMarkdown(markdownContent);
      },
      (error) => {
        console.error('Error reading markdown file:', error);
        // Set default guidelines here
        this.guidelines = 'Default guidelines';
        this.editedGuidelines = this.guidelines;
      }
    );
  }

  // Update Markdown file with edited guidlines
  onSubmit(): void {
    this.markdownService.updateMarkdownFile(this.markdownFilePath, this.editedGuidelines)
      .subscribe(() => {
        console.log('Markdown file updated successfully.');
      });
  }

    // Render Markdown content
    async renderMarkdown(markdown: string): Promise<string> {
      const markdownContent = await marked.parse(markdown);
      return markdownContent;
    }
}
