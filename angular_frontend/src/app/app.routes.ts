import { Routes } from '@angular/router';
import { ReviewAuditComponent } from './components/review-audit/review-audit.component';
import { StatusComponent } from './components/status/status.component';
import { MakeAnAuditComponent } from './components/make-an-audit/make-an-audit.component';
import { LoginComponent } from './components/login/login.component';
import { RegisterComponent } from './components/register/register.component';
import { EditAuditSubmissionGuidelinesComponent } from './components/edit-audit-submission-guidelines/edit-audit-submission-guidelines.component';
import { navbarComponent } from './components/navbar/navbar.component';
import { ProfilePageComponent } from './components/profile-page/profile-page.component';
import { AuditorNavbarComponent } from './components/auditor-navbar/auditor-navbar.component';
import { submitAuditGuard } from './guards/submit-audit.guard';
import { ForgotPasswordComponent } from './components/forgot-password/forgot-password.component';

export const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'navbar', component: navbarComponent },
  { path: 'review-audit', component: ReviewAuditComponent },
  {
    path: 'edit-audit-submission-guidelines',
    component: EditAuditSubmissionGuidelinesComponent,
  },
  { path: 'status', component: StatusComponent },
  { path: 'make-an-audit', component: MakeAnAuditComponent },
  { path: 'profile', component: ProfilePageComponent },
  { path: 'audit-navbar', component: AuditorNavbarComponent },
  { path: 'forgot', component: ForgotPasswordComponent },
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: '**', redirectTo: 'login', pathMatch: 'full' }, //this will be a 404 page, when the user tries to go to a page that doesnt exist }
];
