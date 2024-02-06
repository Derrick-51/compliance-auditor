import { Component } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import {
  FormControl,
  Validators,
  FormsModule,
  ReactiveFormsModule,
  EmailValidator,
  FormGroup,
} from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { EmailfieldComponent } from '../emailfield/emailfield.component';
import { PasswordfieldComponent } from '../passwordfield/passwordfield.component';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { LoginpageService } from './loginpage.service';
import { Inject } from '@nestjs/common';

@Component({
  selector: 'app-loginpage',
  standalone: true,
  imports: [
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    FormsModule,
    ReactiveFormsModule,
    EmailfieldComponent,
    PasswordfieldComponent,
    MatButtonModule,
    MatIconModule,
    MatButtonModule,
    LoginpageService,
  ],
  providers: [LoginpageService],
  templateUrl: './loginpage.component.html',
  styleUrl: './loginpage.component.css',
})
export class LoginpageComponent {
  email = new FormControl('', [Validators.required, Validators.email]);
  getErrorMessage() {
    if (this.email.hasError('required')) {
      return 'You must enter a value';
    }

    return this.email.hasError('email') ? 'Not a valid email' : '';
  }

  loginpageService = Inject(LoginpageService);

  loginForm = new FormGroup({
    email: new FormControl(''),
    password: new FormControl(''),
  });

  submitForm() {
    this.loginpageService.submitForm(
      this.loginForm.value.email ?? '',
      this.loginForm.value.password ?? ''
    );
  }

  hide = true;
}
