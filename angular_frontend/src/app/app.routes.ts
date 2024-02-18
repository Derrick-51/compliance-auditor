import { Routes } from '@angular/router';
import { HomeComponent } from './components/home/home.component';
import { ReviewAuditComponent } from './components/review-audit/review-audit.component';
import { StatusComponent } from './components/status/status.component';
import { MakeAnAuditComponent } from './components/make-an-audit/make-an-audit.component';

export const routes: Routes = [
{path: '', component: HomeComponent},
{path: 'status', component: StatusComponent},
{path: 'make-an-audit', component: MakeAnAuditComponent},
{path: 'review-audit', component: ReviewAuditComponent}
];
