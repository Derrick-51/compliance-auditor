import { Routes } from '@angular/router';
import { HomeComponent } from './components/home/home.component';
import { ImageUploadComponent } from './components/image-upload/image-upload.component';
import { ReviewAuditComponent } from './components/review-audit/review-audit.component';
import { StatusComponent } from './components/status/status.component';

export const routes: Routes = [
{path: '', component: HomeComponent},
{path: 'status', component: StatusComponent},
{path: 'image-upload', component: ImageUploadComponent},
{path: 'override', component: ReviewAuditComponent}
];
