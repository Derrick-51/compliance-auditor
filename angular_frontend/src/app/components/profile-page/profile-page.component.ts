import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { navbarComponent } from '../navbar/navbar.component';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-profile-page',
  standalone: true,
  imports: [CommonModule, navbarComponent, MatCardModule, MatIconModule],
  templateUrl: './profile-page.component.html',
  styleUrl: './profile-page.component.scss'
})
export class ProfilePageComponent {

}
