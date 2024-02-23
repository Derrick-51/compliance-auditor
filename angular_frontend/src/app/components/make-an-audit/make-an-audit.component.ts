import { RouterLink } from '@angular/router';
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { FileUploadService } from '../../services/file-upload.service';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-make-an-audit',
  standalone: true,
  imports: [CommonModule, RouterLink, MatButtonModule, MatCardModule, MatIconModule],
  templateUrl: './make-an-audit.component.html',
  styleUrl: './make-an-audit.component.scss',
})
export class MakeAnAuditComponent {
  currentFiles?: FileList;
  message = '';
  previews: string[] = [];
  hasInvalidFiles = false;

  // Injects file upload service
  constructor(private uploadService: FileUploadService) {}

  // Helper function to convert array of files into a FileList
  private createFileList(files: File[]): FileList {
    const fileList = new ClipboardEvent('').clipboardData || new DataTransfer();
    files.forEach(file => fileList.items.add(file));
    return fileList.files;
  }

  // Updates previews
  selectFiles(event: any): void {
    this.message = '';
    this.previews = [];
    this.hasInvalidFiles = false;
    this.currentFiles = event.target.files;

    if (!this.currentFiles)
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
      } 
      else
        this.hasInvalidFiles = true;
    }

    if (this.hasInvalidFiles == true)
      this.message = 'Invalid files were removed. Please only select PNG, JPG, or JPEG files.';

    this.currentFiles = this.createFileList(validFiles);
  }

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
    if (!this.currentFiles)
      return;
    length = this.currentFiles.length;
    const fileListArray = Array.from(this.currentFiles);
    fileListArray.splice(index, 1);
    this.currentFiles = this.createFileList(fileListArray);
    if (this.currentFiles.length != length - 1)
      this.message = 'Image was not deleted correctly. Reload the page and reselect images.';
  }

  // Displays image url if preview is unable to be displayed
  displayImageUrl(event: any, index: number): void {
    const img = event.target;
    const url = img.src;
    this.previews[index] = url;
  }
} 
