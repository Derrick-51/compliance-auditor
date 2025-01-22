import { Component, EventEmitter, HostListener, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
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
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-login',
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
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss',
})
export class LoginComponent {
  // FormGroup for the login form
  loginForm = this.fb.group({
    username: ['', [Validators.required, Validators.email]], //username is email
    password: ['', [Validators.required]],
  });

  usertype: string = ''; // Variable to store if user is auditor or dealership usertype
  passwordPlaceholder = 'Type your password'; // Default placeholder text for password input
  passwordLabel = 'Enter your password'; // Default label text for password input
  emailLabel = 'Enter your email'; // Default label text for email input

  constructor(
    private fb: FormBuilder, // FormBuilder for creating form groups and controls
    private http: HttpClient, // HttpClient for making HTTP requests
    private router: Router, // Router for navigation
    private toastr: ToastrService // ToastrService for displaying toast notifications
  ) { }

  @Output() toggleFormsEvent = new EventEmitter<void>(); // Event emitter to toggle between login and register forms

  toggleForms(event: MouseEvent) {
    event.preventDefault(); // Prevents default navigation behavior
    this.toggleFormsEvent.emit();
  }

  // Getter function to get the email form control
  get email() {
    return this.loginForm.controls['username'];
  }

  // Getter function to get the password form control
  get password() {
    return this.loginForm.controls['password'];
  }

  // Function to submit login details
  submitLogin() {
    // Extracting form data
    const postData = { ...this.loginForm.value };
    // Making a POST request to the server
    this.http
      .post<any>('http://localhost:3000/auth/login', postData, {
        withCredentials: true,
      })
      // If successful
      .subscribe(
        (response) => {
          // Log the response
          console.log(response);
          // Success toast notification
          this.toastr.success('Login was successful!', 'Logged in!');
          // Storing the user type
          this.usertype = response.usertype;
          // Navigating to different routes based on the user type
          if (this.usertype === 'Auditor') {
            this.router.navigate(['campaigns']); // Navigate to campaigns route for auditors
          } else {
            this.router.navigate(['status']); // Navigate to status route for dealership users
          }
        },
        // if error occurs
        (error) => {
          // Display error message using toastr
          this.toastr.error('Invalid login credentials!', 'Login Error');
        }
      );
  }

  // Function to display error message for the email field
  getEmailErrorMessage() {
    if (this.email.hasError('required')) {
      return 'Email field is empty';
    }
    return this.email.hasError('email') ? 'Please enter a valid email' : '';
  }

  // Function to display error message for the password field
  getPassErrorMessage() {
    if (this.password.hasError('required')) {
      return 'Password field is empty';
    }
    return;
  }

  // Update placeholder text based on viewport
  @HostListener('window:resize', ['$event'])
  onResize(event: any): void {
    this.updatePlaceholder();
    this.updateLabel();
  }

  // Function to update placeholder text for password input based on viewport size
  updatePlaceholder(): void {
    // the two placeholder texts whether the viewport is larger or smaller than 1024px
    this.passwordPlaceholder =
      window.innerWidth < 1024 ? 'Password' : 'Type your password';
  }

  // Function to update label text for email and password inputs based on viewport size
  updateLabel(): void {
    // the two label texts whether the viewport is larger or smaller than 1024px
    this.passwordLabel =
      window.innerWidth < 1024 ? 'Password' : 'Enter your password';
    this.emailLabel = window.innerWidth < 1024 ? 'Email' : 'Enter your email';
  }

  hide = true; // Variable to control password visibility
}
