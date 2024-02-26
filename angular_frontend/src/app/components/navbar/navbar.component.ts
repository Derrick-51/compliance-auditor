import { Component } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatToolbarModule } from '@angular/material/toolbar';
import { RouterModule } from '@angular/router';
import { MatMenuModule } from '@angular/material/menu';
import { ProfilePageComponent } from '../profile-page/profile-page.component';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [MatIconModule, MatButtonModule, MatToolbarModule, RouterModule, MatMenuModule, ProfilePageComponent],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.scss'
})
export class navbarComponent {

}
