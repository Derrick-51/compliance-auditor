import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginpageComponent } from './components/loginpage/loginpage.component';
import { RegisterpageComponent } from './components/registerpage/registerpage.component';
import { HomeComponent } from './components/home/home.component';

const routes: Routes = [
  {
    path: 'login',
    component: LoginpageComponent,
  },
  {
    path: 'register',
    component: RegisterpageComponent,
  },
  {
    path: 'home',
    component: HomeComponent
  },
  {
    path: '', redirectTo: 'home', pathMatch: 'full'
  },
  {
    path: '**', redirectTo: 'home', pathMatch: 'full'   //this will be a 404 page, when the user tries to go to a page that doesnt exist
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
