import { CommonModule, Location, NgFor, NgIf } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { ActivatedRoute, Router } from '@angular/router';
import { MarkdownComponent } from 'ngx-markdown';
import { ToastrService } from 'ngx-toastr';
import { AuditService } from '../../services/audit.service';
import { OverrideService } from '../../services/override.service';
import { ImageModalComponent } from '../image-modal/image-modal.component';
import { Images } from '../review-audit/audit-list';

@Component({
  selector: 'app-override-page',
  standalone: true,
  imports: [
    MatButtonModule,
    MatCardModule,
    MatIconModule,
    NgFor,
    NgIf,
    FormsModule,
    ImageModalComponent,
    MarkdownComponent,
    CommonModule,
  ],
  templateUrl: './override-page.component.html',
  styleUrl: './override-page.component.scss',
})
export class OverridePageComponent {
  constructor(
    private route: ActivatedRoute,
    private location: Location,
    private overrideService: OverrideService,
    private auditService: AuditService,
    private router: Router,
    private toastr: ToastrService
  ) {}

  images: Images[] = [];
  modalImageUrl: string | null = null;
  guidelines: string = '';
  previews: string[] = [];
  message = '';
  auditID: number | undefined;
  startingVerdict: string | undefined;
  showRadioButtons: boolean = false;

  //reveal override
  toggleOverrideButtons() {
    this.showRadioButtons = !this.showRadioButtons;
  }

  //Return to previous page
  goBack(): void {
    this.location.back();
  }

  //Evidence verdict override, but also submits the Review and changes the status
  async startOverride(): Promise<void> {
    await Promise.all(
      this.images.map(async (image) => {
        await this.overrideVerdict(image.id, image.verdict);
      })
    );

    const finalVerdict = this.verdictChecker(this.images);

    if (this.auditID !== undefined) {
      this.updateFinalVerdict(this.auditID, finalVerdict);

      this.router.navigate(['review-audit']);
    } else {
      this.toastr.error('auditID is undefined');
    }
  }

  //update audit final verdict
  updateFinalVerdict(auditID: number, finalVerdict: string) {
    this.auditService.updateFinalVerdict(auditID, finalVerdict).subscribe(
      () => {
        this.toastr.success('Audit verdict updated successfully');
      },
      (error) => {
        this.toastr.error('Error updating final verdict:', error);
      }
    );
  }

  //override evidence verdict
  async overrideVerdict(imageID: number, verdict: string): Promise<void> {
    this.overrideService.overrideVerdict(imageID, verdict).subscribe(
      () => {
        this.toastr.success('Override successful');
      },
      (error) => {
        this.toastr.error('Error overriding evidenct verdict', error);
      }
    );
  }

  //Iterates through every evidence verdict and determines if there is at least ONE failed image before returning as "Failed", otherwise, return as "Passed"
  verdictChecker(images: Images[]): string {
    const failedImages = images.filter(
      (image) => image.verdict.toLowerCase() === 'failed'
    );
    if (failedImages.length > 0) {
      return 'Failed';
    } else {
      return 'Passed';
    }
  }

  //grab evidence connected to the selected audit
  getImages(auditID: number) {
    this.overrideService.getImages(auditID).subscribe((images) => {
      // Sort images by criterion ID
      this.images = images.sort(
        (a, b) =>
          Number(a.criterion.criteriaID) - Number(b.criterion.criteriaID)
      );
    });
  }

  ngOnInit(): void {
    // Retrieve auditID from route parameters
    this.route.params.subscribe((params) => {
      this.auditID = params['auditID'];
      // Once you have auditID, you can call your service method here
      if (this.auditID) {
        this.getImages(this.auditID);
      }
    });
  }

  //Image functions similar to status page
  displayImageUrl(event: any, index: number): void {
    const img = event.target;
    const url = img.src;
    this.previews[index] = url;
  }

  openModal(imageUrl: string): void {
    this.modalImageUrl = imageUrl;
  }

  closeModal(): void {
    this.modalImageUrl = null;
  }
}
