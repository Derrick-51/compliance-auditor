import { Routes } from '@angular/router';
import { ReviewAuditComponent } from './components/review-audit/review-audit.component';
import { StatusComponent } from './components/status/status.component';
import { MakeAnAuditComponent } from './components/make-an-audit/make-an-audit.component';
import { HomeComponent } from './components/home/home.component';
import { LoginComponent } from './components/login/login.component';
import { RegisterComponent } from './components/register/register.component';
import { homeNavbarComponent } from './components/homeNavbar/navbar.component'; 
import { EditAuditSubmissionGuidelinesComponent } from './components/edit-audit-submission-guidelines/edit-audit-submission-guidelines.component';


export const routes: Routes = [
  { path: 'home', component: HomeComponent },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'review-audit', component: ReviewAuditComponent },
  { path: 'edit-audit-submission-guidelines', component: EditAuditSubmissionGuidelinesComponent },
  { path: 'status', component: StatusComponent },
  { path: 'make-an-audit', component: MakeAnAuditComponent },
  { path: '', redirectTo: 'home', pathMatch: 'full' },
  { path: '**', redirectTo: 'home', pathMatch: 'full' }, //this will be a 404 page, when the user tries to go to a page that doesnt exist }
];