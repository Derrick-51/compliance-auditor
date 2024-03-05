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
} from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { RouterModule } from '@angular/router';
import { passwordMatchValidator } from './password-match.directive';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr'

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

  constructor(
    private fb: FormBuilder,
    private http: HttpClient,
    private router: Router,
    private toastr: ToastrService
  ) {}

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
    const postData = { ...this.registerForm.value };
    delete postData.confirmPassword;
    this.http
      .post('http://localhost:3000/auth/register', postData)
      .subscribe((response) => {
        console.log(response);
        this.toastr.success("Your account was successfully created!", "Account Created")
        this.router.navigate(['login']);
      });
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

  passwordFieldHide = true; // initially password is hidden
  confirmFieldHide = true; // initially confirm password is hidden
}
