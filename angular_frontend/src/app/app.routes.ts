import { Routes } from '@angular/router';
import { ImageUploadComponent } from './image-upload/image-upload.component';
import { StatusComponent } from './status/status.component';
import { OverrideComponent } from './override/override.component';

export const routes: Routes = [
{path: 'status', component: StatusComponent},
{path: 'image-upload', component: ImageUploadComponent},
{path: 'override', component: OverrideComponent}
];
