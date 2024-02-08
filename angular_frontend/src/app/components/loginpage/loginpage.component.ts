import { Component } from '@angular/core';
<<<<<<< HEAD:angular_frontend/src/app/loginpage/loginpage.component.ts
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
//import { LoginpageService } from './loginpage.service';
import { Inject } from '@nestjs/common';
=======
import {RouterModule} from '@angular/router';
import {MatCardModule} from '@angular/material/card';
import {MatFormFieldModule} from '@angular/material/form-field';
import {FormControl, Validators, FormsModule, ReactiveFormsModule, EmailValidator, FormGroup, FormBuilder} from '@angular/forms';
import {MatInputModule} from '@angular/material/input';
import {MatButtonModule} from '@angular/material/button';
import {MatIconModule} from '@angular/material/icon';
>>>>>>> Zwar:angular_frontend/src/app/components/loginpage/loginpage.component.ts

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
<<<<<<< HEAD:angular_frontend/src/app/loginpage/loginpage.component.ts
    //LoginpageService,
=======
    RouterModule,
>>>>>>> Zwar:angular_frontend/src/app/components/loginpage/loginpage.component.ts
  ],
  //providers: [LoginpageService],
  templateUrl: './loginpage.component.html',
  styleUrl: './loginpage.component.css',
})

export class LoginpageComponent {
<<<<<<< HEAD:angular_frontend/src/app/loginpage/loginpage.component.ts
  email = new FormControl('', [Validators.required, Validators.email]);
  getErrorMessage() {
    if (this.email.hasError('required')) {
      return 'You must enter a value';
    }

    return this.email.hasError('email') ? 'Not a valid email' : '';
  }

  //loginpageService = Inject(LoginpageService);

  loginForm = new FormGroup({
    email: new FormControl(''),
    password: new FormControl(''),
  });

  submitForm() {
    //this.loginpageService.submitForm(
    this.loginForm.value.email ?? '', this.loginForm.value.password ?? '';
    //);
  }

  hide = true;
=======
  loginForm = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required]]
  })

  constructor(private fb: FormBuilder) {}

  get email() {
    return this.loginForm.controls['email'];
  }
  get password() {
    return this.loginForm.controls['password'];
  }

  getEmailErrorMessage() {
    if (this.email.hasError('required')) {
      return 'Email field is empty'
    }
    return this.email.hasError('email') ? 'Please enter a valid email' : '';
  }

  getPassErrorMessage() {
    if (this.password.hasError('required')) {
      return 'Password field is empty'
    }
    else
      return '';
  }

  submitLogin() {
    console.log(this.loginForm.value)
  }

  hide=true;
>>>>>>> Zwar:angular_frontend/src/app/components/loginpage/loginpage.component.ts
}
