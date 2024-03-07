import { Component } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatToolbarModule } from '@angular/material/toolbar';
import { RouterModule } from '@angular/router';
import { MatMenuModule } from '@angular/material/menu';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';

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
  constructor(private http: HttpClient, private router: Router) {}

  logout() {
    this.http
      .post('http://localhost:3000/auth/logout', {
        withCredentials: true,
      })
      .subscribe((response) => {
        console.log(response);
        this.router.navigate(['login']);
      });
  }
}
