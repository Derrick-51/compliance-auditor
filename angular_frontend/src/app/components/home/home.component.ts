import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LoginComponent } from '../login/login.component';
import { RegisterComponent } from '../register/register.component'; 

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, LoginComponent, RegisterComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent {
  //if the login form is visible or not
  showLoginForm: boolean = true;

  toggleForms() {
    // Toggles showLoginForm between true and false 
    this.showLoginForm = !this.showLoginForm;
  }
}
