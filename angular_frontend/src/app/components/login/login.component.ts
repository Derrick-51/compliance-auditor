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
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';

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
  loginForm = this.fb.group({
    username: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required]],
  });

  constructor(
    private fb: FormBuilder,
    private http: HttpClient,
    private router: Router,
  ) {}

  get email() {
    return this.loginForm.controls['username'];
  }
  get password() {
    return this.loginForm.controls['password'];
  }

  submitLogin() {
    const postData = { ...this.loginForm.value };
    this.http
      .post('http://localhost:3000/auth/login', postData, {
        withCredentials: true,
      })
      .subscribe((response) => {
        console.log(response);
        this.router.navigate(['status']);
      });
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

  hide = true;
}
