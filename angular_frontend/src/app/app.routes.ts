import { Routes } from '@angular/router';
import { ReviewAuditComponent } from './components/review-audit/review-audit.component';
import { StatusComponent } from './components/status/status.component';
import { MakeAnAuditComponent } from './components/make-an-audit/make-an-audit.component';
import { LoginComponent } from './components/login/login.component';
import { RegisterComponent } from './components/register/register.component';
import { navbarComponent } from './components/navbar/navbar.component';

export const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'navbar', component: navbarComponent },
  { path: 'review-audit', component: ReviewAuditComponent },
  { path: 'status', component: StatusComponent },
  { path: 'make-an-audit', component: MakeAnAuditComponent },
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: '**', redirectTo: 'login', pathMatch: 'full' }, //this will be a 404 page, when the user tries to go to a page that doesnt exist }
];