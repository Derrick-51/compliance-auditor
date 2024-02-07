import { Component } from '@angular/core';
import {RouterModule} from '@angular/router';
import {MatCardModule} from '@angular/material/card';
import {MatFormFieldModule} from '@angular/material/form-field';
import {FormControl, Validators, FormsModule, ReactiveFormsModule, EmailValidator, FormGroup, FormBuilder} from '@angular/forms';
import {MatInputModule} from '@angular/material/input';
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
    MatButtonModule,
    MatIconModule,
    MatButtonModule,
    RouterModule,
  ],
  templateUrl: './loginpage.component.html',
  styleUrl: './loginpage.component.css'
})

export class LoginpageComponent {
  loginForm = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required]]
  })

  constructor(private fb: FormBuilder) {}

  hide = true;
  }
