import { RouterLink } from '@angular/router';
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpResponse } from '@angular/common/http';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { FileUploadService } from '../../services/file-upload.service';

@Component({
  selector: 'app-make-an-audit',
  standalone: true,
  imports: [CommonModule, RouterLink, MatButtonModule, MatCardModule],
  templateUrl: './make-an-audit.component.html',
  styleUrl: './make-an-audit.component.scss',
})
export class MakeAnAuditComponent {
  currentFiles?: FileList;
  messages: string[] = [];
  previews: string[] = [];

  // Injects file upload service
  constructor(private uploadService: FileUploadService) {}

  // Updates preview
  selectFiles(event: any): void {
    this.messages = [];
    this.previews = [];
    this.currentFiles = event.target.files;

    if (this.currentFiles && this.currentFiles[0]) {
      const numberOfFiles = this.currentFiles.length;
      for (let i = 0; i < numberOfFiles; i++) {
        const reader = new FileReader();
        reader.onload = (e: any) => {
          console.log(e.target.result);
          this.previews.push(e.target.result);
        };
        reader.readAsDataURL(this.currentFiles[i]);
      }
    }
  }

  // Upload for each individual image
  upload(file:File): void {
    if (file) {
      this.uploadService.upload(file).subscribe({
      next: (event: any) => {
        if (event instanceof HttpResponse) {
          const msg = file.name + ': Successful!';
          this.messages.push(msg);
        }
      },
      error: (err: any) => {
        let msg = file.name + ': Failed!';
        if (err.error && err.error.message) {
          msg += ' ' + err.error.message;
        }
        this.messages.push(msg);
      },
        complete: () => {
          this.currentFiles = undefined;
        },
      });
    }
  }

  // Uploads all images
  uploadFiles(): void {
    this.messages = [];
  
    if (this.currentFiles) {
      for (let i = 0; i < this.currentFiles.length; i++) {
        this.upload(this.currentFiles[i]);
      }
    }
  }

/*  removeSelectedFile(index) {
    delete file from FileList
    this.currentFiles.splice(index, 1);
   } */
} 
