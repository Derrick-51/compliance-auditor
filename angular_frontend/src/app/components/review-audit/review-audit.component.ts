import { NgFor, NgIf, UpperCasePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import {
  MatPaginatorIntl,
  MatPaginatorModule,
  PageEvent,
} from '@angular/material/paginator';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { AuditListService } from '../../services/audit-list.service';
import { CampaignService } from '../../services/campaign.service';
import { PageinatorIntlService } from '../../services/pageinator-intl.service';
import { AuditorNavbarComponent } from '../auditor-navbar/auditor-navbar.component';
import { Audit } from './audit-list';

@Component({
  selector: 'app-review-audit',
  standalone: true,
  imports: [
    AuditorNavbarComponent,
    NgFor,
    FormsModule,
    NgIf,
    UpperCasePipe,
    MatButtonModule,
    MatCardModule,
    AuditorNavbarComponent,
    MatPaginatorModule,
  ],
  templateUrl: './review-audit.component.html',
  styleUrl: './review-audit.component.scss',
  providers: [{ provide: MatPaginatorIntl, useClass: PageinatorIntlService }],
})
export class ReviewAuditComponent implements OnInit {
  constructor(
    private auditlistService: AuditListService, // AuditListService for audit related operations
    private router: Router, // Router for navigation
    private toastr: ToastrService, // ToastrService for displaying toast notifications
    private campaignService: CampaignService // CampaignService for campaign related operations
  ) {}

  audits: Audit[] = []; // List of all audits
  displayedAudits: Audit[] = []; // Audits to be displayed on the current page
  currentPage: number = 0; // Current page number
  pageSize: number = 5; // Number of items per page
  totalItems: number = 0; // Total number of items
  campaignID?: number; // Current active campaign ID

  selectedAudit?: Audit; // Track the selected audit
  lastSelectedAudit?: Audit; // Track the last selected audit to close its details card
  detailsVisibleMap: Map<Audit, boolean> = new Map(); // Map to track visibility of details card

  ngOnInit(): void {
    this.getAudits(); // Get all audits on start
  }

  //Lists all the audits under the current active campagin
  getAudits() {
    this.campaignService.getLatestCampaign().subscribe((latestCampaign) => {
      this.campaignID = latestCampaign.campaignID;
      if (!this.campaignID) {
        this.toastr.error('Failed to load information!', 'Error');
        return;
      }
      this.auditlistService.getAudits(this.campaignID).subscribe((audits) => {
        this.audits = audits;
        //convert raw timestamp from database to formatted date
        this.audits.forEach((audit) => {
          audit.submitDate = new Date(audit.submitDate).toLocaleString();
        });
        this.totalItems = this.audits.length; // Update total items
        this.fetchAudits(); // Fetch initial audits
      });
    });
  }

  onSelect(audit: Audit): void { // Selects the audit and calls the toggleDetails function
    this.selectedAudit = audit;
    this.toggleDetails(audit);
  }

  //Goes to override page using the selected audit
  startReview(auditID: number): void {
    console.log('Selected ID: ' + auditID);
    this.router.navigate(['override-page', auditID]);
  }

  //Toggles the details card of the selected audit
  toggleDetails(audit: Audit) {
    if (this.selectedAudit === audit) {
      // If the same audit is clicked again, close its details card
      this.detailsVisibleMap.set(audit, false);
      this.selectedAudit = undefined;
    } else {
      // Close the last selected audit's details card
      if (this.lastSelectedAudit && this.lastSelectedAudit !== audit) {
        this.detailsVisibleMap.set(this.lastSelectedAudit, false);
      }
      this.detailsVisibleMap.set(audit, true); // Open the clicked audit's details card
      this.selectedAudit = audit; // Set the selected audit
      this.lastSelectedAudit = audit; // Update the last selected audit
    }
  }

  isDetailsVisible(audit: Audit): boolean {
    return this.detailsVisibleMap.get(audit) || false; // return visibility state or default to false
  }

  handlePageEvent(pageEvent: PageEvent) {
    this.currentPage = pageEvent.pageIndex;
    this.pageSize = pageEvent.pageSize;
    // Fetch audits based on current page and page size
    this.fetchAudits();
  }

  fetchAudits() {
    const startIndex = this.currentPage * this.pageSize; // Calculate start index
    const endIndex = startIndex + this.pageSize; // Calculate end index
    this.displayedAudits = this.audits.slice(startIndex, endIndex); // Calculate number of audits based on start and end index
  }
}
