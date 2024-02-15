import { Component } from '@angular/core';
import { homeNavbarComponent } from '../home-navbar/navbar.component';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [homeNavbarComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent {

}
