import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { navbarComponent } from '../navbar/navbar.component';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { UserService } from '../../services/user.service';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-profile-page',
  standalone: true,
  imports: [CommonModule, navbarComponent, MatCardModule, MatIconModule],
  templateUrl: './profile-page.component.html',
  styleUrl: './profile-page.component.scss',
})
export class ProfilePageComponent implements OnInit {
  user: any;
  dealershipEmail!: string;
  dealershipState!: string;
  dealershipCity!: string;
  dealershipAddress!: string;
  firstName!: string;
  lastName!: string;

  constructor (
    private userService: UserService, 
    private http: HttpClient
    
    ) { }

  ngOnInit(): void {
    this.http
      .get<any>('http://localhost:3000/auth/profile', { withCredentials: true })
      .subscribe((data) => {
        const { email, state, city, address, firstName, lastName } = data;
        this.dealershipEmail = email;
        this.dealershipState = state;
        this.dealershipCity = city;
        this.dealershipAddress = address;
        this.firstName = firstName;
        this.lastName = lastName;

        console.log(data);
      });
  }
}
