import { Component, HostListener } from '@angular/core';
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
import { ToastrService } from 'ngx-toastr'

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
    private toastr: ToastrService
,
  ) { }

  get email() {
    return this.loginForm.controls['username'];
  }
  get password() {
    return this.loginForm.controls['password'];
  }

  submitLogin() { //this is using an old method, we might switch it later
    const postData = { ...this.loginForm.value };
    this.http
      .post('http://localhost:3000/auth/login', postData, {
        withCredentials: true,
      })
      .subscribe((response) => {
        console.log(response);
        this.router.navigate(['status']);
      },
        (error) => {
          this.toastr.error('Invalid login credentials!', 'Login Error');
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

  passwordPlaceholder = 'Type your password'; // Default placeholder text
  passwordLabel = 'Enter your password'; // Default label text
  emailLabel = 'Enter your password'; // Default label text

  // Update placeholder text based on viewport size
  @HostListener('window:resize', ['$event'])
  onResize(event: any): void {
    this.updatePlaceholder();
    this.updateLabel();
  }

  updatePlaceholder(): void {
    // Set different placeholder text for small viewports
    this.passwordPlaceholder = window.innerWidth < 1024 ? 'Password' : 'Type your password';
  }

  updateLabel(): void {
    // Set different label text for small viewports
    this.passwordLabel = window.innerWidth < 1024 ? 'Password' : 'Enter your password';
    this.emailLabel = window.innerWidth < 1024 ? 'Email' : 'Enter your email';
  }

  hide = true;
}
