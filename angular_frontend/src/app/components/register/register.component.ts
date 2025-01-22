import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, EventEmitter, Output } from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { Router, RouterModule } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { strongPasswordValidator } from '../../services/strong-password.validator';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatFormFieldModule,
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
  passwordFieldHide = true; // initially password is hidden
  confirmFieldHide = true; // initially confirm password is hidden
  
  registerForm = this.fb.group( // FormGroup for the register form
    {
      dealership: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email]],
      password: [
        '',
        [Validators.required, Validators.minLength(8), strongPasswordValidator],
      ],
      confirmPassword: ['', [Validators.required]],
    },
    {
      validators: this.passwordMatchValidator,
    }
  );

  constructor(
    private fb: FormBuilder, // FormBuilder for creating form groups and controls
    private http: HttpClient, // HttpClient for making HTTP requests
    private router: Router, // Router for navigation
    private toastr: ToastrService // ToastrService for displaying toast notifications
  ) { }

  @Output() toggleFormsEvent = new EventEmitter<void>(); // Event emitter to toggle between login and register forms

  toggleForms(event: MouseEvent) {
    event.preventDefault(); // Prevents default navigation behavior
    this.toggleFormsEvent.emit(); // allows toggle between login and register forms
  }

  // Getter functions for form controls
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

  submitDetails() {
    // Extracting form data
    const postData = { ...this.registerForm.value };
    // Removing confirmPassword field from postData as its not necessary
    delete postData.confirmPassword;
    // Making a POST request to the server
    this.http.post('http://localhost:3000/auth/register', postData).subscribe(
      // If successful
      (response) => {
        // Log the response
        console.log(response);
        // Success toast notification
        this.toastr.success("Your account was successfully created!", "Account Created");
        // Reload the page after successful registration
        window.location.reload();
      },
      // if error occurs
      (error) => {
        // Display error message using toastr
        this.toastr.error(
          'An account with this email already exists!',
          'Registration Error'
        );
      }
    );
  }

  // Function to display error messages for the dealership name field
  getDealerErrorMessage() {
    if (this.dealership.hasError('required')) {
      return 'Please enter the name of your dealership';
    }
    return;
  }

  // Function to display error messages for the email field
  getEmailErrorMessage() {
    if (this.email.hasError('required')) {
      return 'Email field is empty';
    }
    return this.email.hasError('email') ? 'Please enter a valid email' : '';
  }

  // Function to display error messages for the password field
  getPassErrorMessage() {
    if (this.password.hasError('required')) {
      return 'Password field is empty';
    }
    if (this.password.hasError('minlength' && 'strongPassword')) {
      return 'Password requires one uppercase & lowercase letter, a number, and a special character';
    }
    return;
  }

  // Function to display error messages for the confirm password field
  getConfirmPassErrorMessage() {
    if (this.confirmPassword.hasError('required')) {
      return 'Confirm password field is empty';
    }
    return this.confirmPassword.hasError('passwordMatchValidator')
      ? 'Password does not match'
      : '';
  }

  // Function to validate password and confirm password match
  passwordMatchValidator(control: AbstractControl) {
    return control.get('password')?.value ===
      control.get('confirmPassword')?.value
      ? null
      : { mismatch: true };
  }
}
