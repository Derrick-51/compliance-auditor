import { Routes } from '@angular/router';
import { LoginpageComponent } from './components/loginpage/loginpage.component';
import { ImageUploadComponent } from './image-upload/image-upload.component';
import { StatusComponent } from './status/status.component';
import { AuditReviewComponent } from './audit_review/audit_review.component';
import { RegisterpageComponent } from './components/registerpage/registerpage.component';

export const routes: Routes = [
  { path: 'status', component: StatusComponent },
  { path: 'image-upload', component: ImageUploadComponent },
  { path: 'audit_review', component: AuditReviewComponent },
  {
    path: 'login',
    component: LoginpageComponent,
  },
  {
    path: 'register',
    component: RegisterpageComponent,
  },
  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full',
  },
  {
    path: '**',
    redirectTo: 'login',
    pathMatch: 'full', //this will be a 404 page, when the user tries to go to a page that doesnt exist
  },
];
