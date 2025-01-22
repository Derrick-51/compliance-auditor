import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import {
  FormControl,
  Validators,
  FormsModule,
  ReactiveFormsModule,
  FormBuilder,
  FormGroup,
  AbstractControl,
} from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { RouterModule } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr'

@Component({
  selector: 'app-forgot-password',
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
    RouterModule,],
  templateUrl: './forgot-password.component.html',
  styleUrl: './forgot-password.component.scss'
})
export class ForgotPasswordComponent {

  passwordFieldHide = true; // boolean to hide password field
  confirmFieldHide = true; // boolean to hide confirm password field

  // FormGroup for forget password form
  forgotPassForm = this.fb.group(
    {
      email: ['', [Validators.required, Validators.email]], // Email field with validators
    },
  );

  constructor(
    private fb: FormBuilder, // FormBuilder for creating form groups and controls
    private http: HttpClient, // HttpClient for making HTTP requests
    private router: Router, // Router for navigation
    private toastr: ToastrService // ToastrService for displaying toast notifications
  ) { }

  // Getter function to get the email form control
  get email() {
    return this.forgotPassForm.controls['email'];
  }

  // Function to submit password recovery details
  submitDetails() {
    // Extracting form data
    const postData = { ...this.forgotPassForm.value };
    // Making a POST request to the server
    this.http
      .post('http://localhost:3000/auth/forgot', postData)
      // If successful
      .subscribe((response) => {
        // Log the response
        console.log(response);
        // Success toast notification
        this.toastr.success("Please check your email for further instructions!", "Email Sent")
        // Navigating to the home page
        this.router.navigate(['login']);
      },
        // if error occurs
        (error) => {
          // Error toast notification
          this.toastr.error('An error has occurred sending the email!', 'Error');
        });
  }

  // Function to display error message for the email field
  getEmailErrorMessage() {
    if (this.email.hasError('required')) {
      return 'Email field is empty';
    }
    return this.email.hasError('email') ? 'Please enter a valid email' : '';
  }

}
