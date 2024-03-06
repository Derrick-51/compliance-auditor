import { RouterLink } from '@angular/router';
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { FileUploadService } from '../../services/file-upload.service';
import { MatIconModule } from '@angular/material/icon';
import { navbarComponent } from '../navbar/navbar.component';
import { MarkdownModule } from 'ngx-markdown';
import { ImageModalComponent } from '../image-modal/image-modal.component';
@Component({
  selector: 'app-make-an-audit',
  standalone: true,
  imports: [CommonModule, RouterLink, MatButtonModule, MatCardModule, MatIconModule, navbarComponent, MarkdownModule, ImageModalComponent],
  templateUrl: './make-an-audit.component.html',
  styleUrl: './make-an-audit.component.scss',
})
export class MakeAnAuditComponent implements OnInit {
  audit?: FileList;
=======
  imports: [CommonModule, RouterLink, MatButtonModule, MatCardModule, MatIconModule, navbarComponent],
  templateUrl: './make-an-audit.component.html',
  styleUrl: './make-an-audit.component.scss',
})
export class MakeAnAuditComponent {
  currentFiles?: FileList;
>>>>>>> parent of 1483645e (Merge pull request #21 from Derrick-51/Shane-2)
  message = '';
  previews: string[] = [];
  hasInvalidFiles = false;

<<<<<<< HEAD
  // Inject file upload and markdown file services
  constructor(
    private uploadService: FileUploadService,
    private readGuidelinesService: ReadGuidelinesService
  ) {}

  // Read Markdown file and set guidelines to its content when page is loaded
  ngOnInit(): void {
    this.readGuidelinesService
      .readGuidelines()
      .subscribe((markdownContent: string) => {
        this.guidelines = markdownContent;
      });
  }
=======
  // Injects file upload service
  constructor(private uploadService: FileUploadService) {}
>>>>>>> parent of 1483645e (Merge pull request #21 from Derrick-51/Shane-2)

  // Helper function to convert array of files into a FileList
  private createFileList(files: File[]): FileList {
    const fileList = new ClipboardEvent('').clipboardData || new DataTransfer();
    files.forEach((file) => fileList.items.add(file));
    return fileList.files;
  }

  // Updates previews
  selectFiles(event: any): void {
    this.message = '';
    this.previews = [];
    this.hasInvalidFiles = false;
    this.currentFiles = event.target.files;

<<<<<<< HEAD
    if (!this.audit) return;

    if (!this.audit)
      return;
    
    // Filter files by allowed extensions (PNG, JPG, JPEG)
    const allowedExtensions = ['png', 'jpg', 'jpeg'];
    const validFiles: File[] = [];

    for (let i = 0; i < this.currentFiles.length; i++) {
      const file = this.currentFiles[i];
      const extension = file.name.split('.').pop()?.toLowerCase();
      if (extension && allowedExtensions.includes(extension)) {
        validFiles.push(file);
        const reader = new FileReader();
        reader.onload = (e: any) => {
          console.log(e.target.result);
          this.previews.push(e.target.result);
        };
        reader.readAsDataURL(file);
      } else this.hasInvalidFiles = true;
    }

    if (this.hasInvalidFiles == true)
      this.message =
        'Invalid files were removed. Please only select PNG, JPG, or JPEG files.';

    this.currentFiles = this.createFileList(validFiles);
  }

<<<<<<< HEAD
  // Upload individual images of submitted audit
  upload(file: File): void {
    if (!file) return;
    this.uploadService.upload(file).subscribe({
      error: (err: any) => {
        this.message = 'Could not submit audit. Please run nest backend.';
      },
      complete: () => {
        this.audit = undefined;
      },
    });
  }

  // Uploads all images of submitted audit
  submitAudit(): void {
    if (!this.audit) return;
    for (let i = 0; i < this.audit.length; i++) {
      this.upload(this.audit[i]);
=======
  // Upload for each individual image
  upload(file:File): void {
    if (file) {
      this.uploadService.upload(file).subscribe({
        error: (err: any) => {
          this.message = 'Could not upload images. Please run nest backend.';
        },
        complete: () => {
          this.currentFiles = undefined;
        },
      });
>>>>>>> parent of 1483645e (Merge pull request #21 from Derrick-51/Shane-2)
    }
  }

  // Uploads all images
  uploadFiles(): void {
    if (!this.currentFiles)
      return;
    for (let i = 0; i < this.currentFiles.length; i++) {
      this.upload(this.currentFiles[i]);
    }
  }

  // Deletes image
  deleteImage(index: number): void {
    this.message = '';
    this.previews.splice(index, 1);
    if (!this.audit)
      return;
    length = this.audit.length;
    const images = Array.from(this.audit);
    images.splice(index, 1);
    this.audit = this.createFileList(images);
    if (this.audit.length != length - 1)
      this.message = 'Image was not deleted correctly. Reload the page and reselect images.';
  }

  // Displays image url if preview is unable to be displayed
  displayImageUrl(event: any, index: number): void {
    const img = event.target;
    const url = img.src;
    this.previews[index] = url;
  }
<<<<<<< HEAD

  openModal(imageUrl: string): void {
    this.modalImageUrl = imageUrl;
  }

  closeModal(): void {
    this.modalImageUrl = null;
  }
} 