import { Component } from '@angular/core';
import { homeNavbarComponent } from '../homeNavbar/navbar.component';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [homeNavbarComponent],
  templateUrl: './register.component.html',
  styleUrl: './register.component.scss'
})
export class RegisterComponent {

}
