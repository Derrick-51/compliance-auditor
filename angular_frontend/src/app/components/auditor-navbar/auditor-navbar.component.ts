import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatToolbarModule } from '@angular/material/toolbar';
import { Router, RouterModule } from '@angular/router';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-auditor-navbar',
  standalone: true,
  imports: [
    MatIconModule,
    MatButtonModule,
    MatToolbarModule,
    RouterModule,
    MatMenuModule,
    RouterModule,
  ],
  templateUrl: './auditor-navbar.component.html',
  styleUrl: './auditor-navbar.component.scss',
})

export class AuditorNavbarComponent {
  constructor(
    private http: HttpClient, // HttpClient for making HTTP requests
    private router: Router, // Router for navigation
    private toastr: ToastrService // ToastrService for displaying toast notifications
  ) { }

  // Function to logout the user
  logout() {
    // Making a POST request to the logout endpoint
    this.http
      .post('http://localhost:3000/auth/logout', {
        withCredentials: true, //withCredentials allows to send with cookies
      })
      // Subscribing to the response from the server
      .subscribe((response) => {
        console.log(response); // Logging the response to the console
        // Success toast notification
        this.toastr.success('Loggout was successful!', 'Logged Out');
        // Routing to home page
        this.router.navigate(['home']);
      });
  }
}
