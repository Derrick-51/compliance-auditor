import { Routes } from '@angular/router';
import { LoginpageComponent } from './loginpage/loginpage.component';
import { ImageUploadComponent } from './image-upload/image-upload.component';
import { StatusComponent } from './status/status.component';
import { OverrideComponent } from './override/override.component';

export const routes: Routes = [
{path: '', component: LoginpageComponent},
{path: 'status', component: StatusComponent},
{path: 'image-upload', component: ImageUploadComponent},
{path: 'override', component: OverrideComponent}
];
