import { Component } from '@angular/core';
import { navbarComponent } from '../navbar/navbar.component';

@Component({
  selector: 'app-profile-page',
  standalone: true,
  imports: [navbarComponent],
  templateUrl: './profile-page.component.html',
  styleUrl: './profile-page.component.scss'
})
export class ProfilePageComponent {

}
