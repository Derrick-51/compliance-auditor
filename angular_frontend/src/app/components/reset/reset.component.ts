import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  FormsModule,
  ReactiveFormsModule,
  Validators
} from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { strongPasswordValidator } from '../../services/strong-password.validator';

@Component({
  selector: 'app-reset',
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
  templateUrl: './reset.component.html',
  styleUrl: './reset.component.scss'
})
export class ResetComponent {
  passwordFieldHide = true; // initially password is hidden
  confirmFieldHide = true; // initially confirm password is hidden

  // FormGroup for reset password form
  resetPassForm = this.fb.group(
    {
      password: [
        '',
        [Validators.required, Validators.minLength(8), strongPasswordValidator],
      ],
      confirmPassword: ['', [Validators.required]],
    },
    {
      validators: this.passwordMatchValidator,
    }
  );

  constructor(
    private fb: FormBuilder, // FormBuilder for creating form groups and controls
    private http: HttpClient, // HttpClient for making HTTP requests
    private router: Router, // Router for navigation
    private toastr: ToastrService, // ToastrService for displaying toast notifications
    private route: ActivatedRoute // ActivatedRoute for getting route parameters
  ) { }

  // Getter functions for form controls
  get password() {
    return this.resetPassForm.controls['password'];
  }
  get confirmPassword() {
    return this.resetPassForm.controls['confirmPassword'];
  }

  submitDetails() {
    const formData = this.resetPassForm.getRawValue();
    const postData = {
      ...formData,
      token: this.route.snapshot.params['token']
    };
    this.http
      .post('http://localhost:3000/auth/reset', postData)
      .subscribe((response) => {
        console.log(response);
        this.toastr.success("Your password has been changed!", "Password Changed!")
        this.router.navigate(['login']);
      },
        // if error occurs
        (error) => {
          this.toastr.error('There was an error changing your password!', 'Error');
        });
  }

  // Function to display error messages for the password field
  getPassErrorMessage() {
    if (this.password.hasError('required')) {
      return 'Password field is empty';
    }
    if (this.password.hasError('minlength' && 'strongPassword')) {
      return 'Password requires one uppercase & lowercase letter, a number, and a special character';
    }
    return;
  }

  // Function to display error messages for the confirm password field
  getConfirmPassErrorMessage() {
    if (this.confirmPassword.hasError('required')) {
      return 'Confirm password field is empty';
    }
    return this.confirmPassword.hasError('passwordMatchValidator') ? 'Password does not match' : '';

  };

  passwordMatchValidator(control: AbstractControl) {
    return control.get('password')?.value === control.get('confirmPassword')?.value ? null : { mismatch: true };
  }

}
