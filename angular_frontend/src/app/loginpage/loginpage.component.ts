import { Component } from '@angular/core';
import {MatCardModule} from '@angular/material/card';
import {MatFormFieldModule} from '@angular/material/form-field';
import {FormControl, Validators, FormsModule, ReactiveFormsModule, EmailValidator, FormGroup} from '@angular/forms';
import {MatInputModule} from '@angular/material/input';
import { EmailfieldComponent } from '../emailfield/emailfield.component';
import { PasswordfieldComponent } from '../passwordfield/passwordfield.component';
import {MatButtonModule} from '@angular/material/button';
import {MatIconModule} from '@angular/material/icon';

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
  ],
  templateUrl: './loginpage.component.html',
  styleUrl: './loginpage.component.css'
})
export class LoginpageComponent {
  email = new FormControl('', [Validators.required, Validators.email]);
  getErrorMessage() {
    if (this.email.hasError('required')) {
      return 'You must enter a value';
    }

    return this.email.hasError('email') ? 'Not a valid email' : '';
  }

  loginForm = new FormGroup({
    email: new FormControl(''),
    password: new FormControl('')
  })

  submitForm() {
    if (this.loginForm.valid){
      console.log("form submitted")
    }
  }

  hide = true;
  }
