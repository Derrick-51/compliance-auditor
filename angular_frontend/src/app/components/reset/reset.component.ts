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
import { ActivatedRoute, RouterModule } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr'

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

  resetPassForm = this.fb.group(
    {
      password: ['', [Validators.required]],
      confirmPassword: ['', [Validators.required]],
    },
    {
      validators: this.passwordMatchValidator,
    }
  );

  constructor(
    private fb: FormBuilder,
    private http: HttpClient,
    private router: Router,
    private toastr: ToastrService,
    private route: ActivatedRoute
  ) { }

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
        (error) => {
          this.toastr.error('There was an error changing your password!', 'Error');
        });
  }

  getPassErrorMessage() {
    if (this.password.hasError('required')) {
      return 'Password field is empty';
    }
    return;
  }

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
