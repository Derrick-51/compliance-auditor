import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { homeNavbarComponent } from '../homeNavbar/navbar.component';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import {
  FormControl,
  Validators,
  FormsModule,
  ReactiveFormsModule,
  FormBuilder,
} from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { RouterModule } from '@angular/router';
import { passwordMatchValidator } from './password-match.directive';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [
    homeNavbarComponent,
    CommonModule,
    MatCardModule,
    MatFormFieldModule,
    homeNavbarComponent,
    ReactiveFormsModule,
    FormsModule,
    MatInputModule,
    MatIconModule,
    MatButtonModule,
    RouterModule,
  ],
  templateUrl: './register.component.html',
  styleUrl: './register.component.scss',
})
export class RegisterComponent {
  registerForm = this.fb.group(
    {
      dealership: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required]],
      confirmPassword: ['', [Validators.required]],
    },
    {
      validators: passwordMatchValidator,
    }
  );

  constructor(private fb: FormBuilder) {}

  get dealership() {
    return this.registerForm.controls['dealership'];
  }

  get email() {
    return this.registerForm.controls['email'];
  }
  get password() {
    return this.registerForm.controls['password'];
  }

  get confirmPassword() {
    return this.registerForm.controls['confirmPassword'];
  }

  getDealerErrorMessage() {
    if (this.dealership.hasError('required')) {
      return 'Please enter the name of your dealership';
    }
    return;
  }

  getEmailErrorMessage() {
    if (this.email.hasError('required')) {
      return 'Email field is empty';
    }
    return this.email.hasError('email') ? 'Please enter a valid email' : '';
  }
  getPassErrorMessage() {
    if (this.password.hasError('required')) {
      return 'Password field is empty';
    }
    return;
  }
  getConfirmPassErrorMessage() {
    if (this.confirmPassword.hasError('required')) {
      return 'Password does not match';
    }
    return;
  }

  hide = true;
}
