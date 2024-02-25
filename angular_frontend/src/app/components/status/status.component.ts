import { Component } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { RouterLink } from '@angular/router';
import { navbarComponent } from '../navbar/navbar.component';

@Component({
  selector: 'app-status',
  standalone: true,
  imports: [MatButtonModule, RouterLink, navbarComponent],
  templateUrl: './status.component.html',
  styleUrl: './status.component.scss'
})
export class StatusComponent {

}