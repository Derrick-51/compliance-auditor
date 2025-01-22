import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-image-modal',
  standalone: true,
  imports: [ CommonModule ],
  templateUrl: './image-modal.component.html',
  styleUrls: ['./image-modal.component.scss']
})
export class ImageModalComponent {
  @Input() imageUrl: string | null = null;
  @Output() close: EventEmitter<void> = new EventEmitter<void>();

  closeModal(): void {
    this.close.emit();
  }

  calculateImageModalSize(): { [key: string]: string } {
    const img: HTMLImageElement = document.createElement('img');
    img.src = this.imageUrl || '';
    const maxWidth = window.innerWidth * 0.9; // 90% of the window width
    const maxHeight = window.innerHeight * 0.9; // 90% of the window height
    const ratio = Math.min(maxWidth / img.width, maxHeight / img.height, 1); // Use the smallest ratio
    return {
      width: `${img.width * ratio}px`,
      height: `${img.height * ratio}px`
    };
  }
}