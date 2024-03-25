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

  passwordFieldHide = true; // initially password is hidden
  confirmFieldHide = true; // initially confirm password is hidden

  forgotPassForm = this.fb.group(
    {
      email: ['', [Validators.required, Validators.email]],
    },
  );

  constructor(
    private fb: FormBuilder,
    private http: HttpClient,
    private router: Router,
    private toastr: ToastrService
  ) { }

  get email() {
    return this.forgotPassForm.controls['email'];
  }

  submitDetails() {
    const postData = { ...this.forgotPassForm.value };
    this.http
      .post('http://localhost:3000/auth/forgot', postData)
      .subscribe((response) => {
        console.log(response);
        this.toastr.success("Please check your email for further instructions!", "Email Sent")
        this.router.navigate(['login']);
      },
        (error) => {
          this.toastr.error('An error has occured sending the email!', 'Error');
        });
  }

  getEmailErrorMessage() {
    if (this.email.hasError('required')) {
      return 'Email field is empty';
    }
    return this.email.hasError('email') ? 'Please enter a valid email' : '';
  }

}
