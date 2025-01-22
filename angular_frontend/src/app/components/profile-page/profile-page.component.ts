import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { navbarComponent } from '../navbar/navbar.component';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { UserService } from '../../services/user.service';
import { HttpClient } from '@angular/common/http';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-profile-page',
  standalone: true,
  imports: [
    CommonModule,
    navbarComponent,
    MatCardModule,
    MatIconModule,
    ReactiveFormsModule,
    MatButtonModule,
    MatInputModule,
    MatSelectModule,
  ],
  templateUrl: './profile-page.component.html',
  styleUrl: './profile-page.component.scss',
})
export class ProfilePageComponent implements OnInit {
  user!: number;
  dealershipEmail!: string;
  dealershipState!: string;
  dealershipCity!: string;
  dealershipAddress!: string;
  dealershipName!: string;
  firstName!: string;
  lastName!: string;
  profileForm = new FormGroup({
    firstName: new FormControl(''),
    lastName: new FormControl(''),
    address: new FormControl(''),
    city: new FormControl(''),
    state: new FormControl(''),
  });

  constructor(
    private userService: UserService,
    private http: HttpClient,
    private fb: FormBuilder,
    private toastr: ToastrService
  ) {}

  ngOnInit(): void {
    // Fetch user profile data from the server on component initialization
    this.http
      .get<any>('http://localhost:3000/auth/profile', { withCredentials: true })
      .subscribe((data) => {
        const {
          id,
          email,
          state,
          city,
          address,
          firstName,
          lastName,
          dealershipName,
        } = data;
        this.user = id;
        this.dealershipName = dealershipName;
        this.dealershipEmail = email;
        this.dealershipState = state;
        this.dealershipCity = city;
        this.dealershipAddress = address;
        this.firstName = firstName;
        this.lastName = lastName;

        //called after grabbing user information
        this.createProfileForm();
      });
  }

  //Populates profile page with user information from the database
  createProfileForm(): void {
    const defaultFirstName = this.firstName ? this.firstName : '';
    const defaultLastName = this.lastName ? this.lastName : '';
    const defaultAddress = this.dealershipAddress ? this.dealershipAddress : '';
    const defaultCity = this.dealershipCity ? this.dealershipCity : '';
    const defaultState = this.dealershipState ? this.dealershipState : '';

    this.profileForm = this.fb.group({
      firstName: [defaultFirstName, [Validators.required]],
      lastName: [defaultLastName, [Validators.required]],
      address: [defaultAddress, [Validators.required]],
      city: [defaultCity, [Validators.required]],
      state: [defaultState, [Validators.required]],
    });
  }

  //Updates the user's profile using the input from the profile page
  updateProfile() {
    if (this.profileForm.valid) {
      const updatedData = this.profileForm.value;
      this.userService.updateProfile(this.user, updatedData).subscribe({
        next: (response) => {
          // Handle successful update
          console.log(response);
          this.toastr.success('Profile updated successfully');
        },
        error: (error) => {
          // Handle errors
          this.toastr.error('Error updating profile:');
        },
      });
    } else {
      // Handle invalid form
      this.toastr.error('Invalid form data');
    }
  }
}
