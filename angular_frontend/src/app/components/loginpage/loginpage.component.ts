import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import {
  FormControl,
  Validators,
  FormsModule,
  ReactiveFormsModule,
  EmailValidator,
  FormGroup,
  FormBuilder,
} from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-loginpage',
  standalone: true,
  imports: [
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    FormsModule,
    ReactiveFormsModule,
    MatButtonModule,
    MatIconModule,
    MatButtonModule,
    RouterModule,
  ],
  templateUrl: './loginpage.component.html',
  styleUrl: './loginpage.component.css',
})
export class LoginpageComponent {
  loginForm = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required]],
  });

  constructor(private fb: FormBuilder, private http: HttpClient) {}

  get email() {
    return this.loginForm.controls['email'];
  }
  get password() {
    return this.loginForm.controls['password'];
  }

  submitLogin() {
    if (this.loginForm.valid) {
      const { email, password } = this.loginForm.value;
      this.http
        .post<any>('http://localhost:3000/auth/login', { email, password })
        .subscribe(
          (response) => {
            console.log('Login successful', response);
          },
          (error) => {
            console.error('Login failed', error);
          }
        );
    }
    console.log(this.loginForm.value);
  }

  getEmailErrorMessage() {
    const emailControl = this.loginForm.get('email');
    if (emailControl.hasError('required')) {
      return 'Email field is empty';
    }
    return emailControl.hasError('email') ? 'Please enter a valid email' : '';
  }

  getPassErrorMessage() {
    const passControl = this.loginForm.get('password');
    if (passControl.hasError('required')) {
      return 'Password field is empty';
    } else return '';
  }

  hide = true;
}
