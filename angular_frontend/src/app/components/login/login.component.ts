import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { homeNavbarComponent } from '../homeNavbar/navbar.component';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { FormControl, Validators, FormsModule, ReactiveFormsModule, FormBuilder } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule,
    MatCardModule,
    MatFormFieldModule,
    homeNavbarComponent,
    ReactiveFormsModule,
    FormsModule,
    MatInputModule,
    MatIconModule,
    MatButtonModule,
    RouterModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent {

  loginForm = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required]]
  })

  constructor(private fb: FormBuilder) {

  }

  get email() {
    return this.loginForm.controls['email'];
  }
  get password() {
    return this.loginForm.controls['password'];
  }
  
  getEmailErrorMessage() {
    if (this.email.hasError('required')) {
      return 'Email field is empty'
    }
    return this.email.hasError('email') ? 'Please enter a valid email' : '';
  }
  getPassErrorMessage() {
    if (this.password.hasError('required')) {
      return 'Password field is empty';
    }
    return;
  }

  hide = true;

}
