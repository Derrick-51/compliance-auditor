import { Routes } from '@angular/router';
import { AuditorNavbarComponent } from './components/auditor-navbar/auditor-navbar.component';
import { CampaignListComponent } from './components/campaign-list/campaign-list.component';
import { EditAuditSubmissionGuidelinesComponent } from './components/edit-audit-submission-guidelines/edit-audit-submission-guidelines.component';
import { ForgotPasswordComponent } from './components/forgot-password/forgot-password.component';
import { HomeComponent } from './components/home/home.component';
import { MakeAnAuditComponent } from './components/make-an-audit/make-an-audit.component';
import { OverridePageComponent } from './components/override-page/override-page.component';
import { ProfilePageComponent } from './components/profile-page/profile-page.component';
import { ResetComponent } from './components/reset/reset.component';
import { ReviewAuditComponent } from './components/review-audit/review-audit.component';
import { StatusComponent } from './components/status/status.component';
import { dealershipGuard } from './guards/dealership.guard';
import { auditorGuard } from './guards/auditor.guard';
import { pendingAuditGuard } from './guards/pending-audit.guard';

export const routes: Routes = [
  { path: 'home', component: HomeComponent },
  {
    path: 'review-audit',
    component: ReviewAuditComponent,
    canActivate: [auditorGuard],
  },
  {
    path: 'override-page/:auditID',
    component: OverridePageComponent,
    canActivate: [auditorGuard],
  },
  {
    path: 'campaign/:campaignID',
    component: EditAuditSubmissionGuidelinesComponent,
    canActivate: [auditorGuard],
  },
  {
    path: 'status',
    component: StatusComponent,
    canActivate: [dealershipGuard],
  },
  {
    path: 'make-an-audit',
    component: MakeAnAuditComponent,
    canActivate: [dealershipGuard, pendingAuditGuard],
  },
  { path: 'profile', component: ProfilePageComponent },
  { path: 'audit-navbar', component: AuditorNavbarComponent },
  {
    path: 'campaigns',
    component: CampaignListComponent,
    canActivate: [auditorGuard],
  },
  { path: 'forgot', component: ForgotPasswordComponent },
  { path: 'reset/:token', component: ResetComponent },
  { path: '', redirectTo: 'home', pathMatch: 'full' },
  { path: '**', redirectTo: 'home', pathMatch: 'full' }, //this will be a 404 page, when the user tries to go to a page that doesnt exist }
];
