import { Component } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatToolbarModule } from '@angular/material/toolbar';
import { RouterModule } from '@angular/router';
import { MatMenuModule } from '@angular/material/menu';


@Component({
<<<<<<< HEAD
  selector: 'app-navbar',
=======
  selector: 'app-homeNavbar',
>>>>>>> parent of b3da9aff (Deleting angular front-end (re merging to get new one))
  standalone: true,
  imports: [MatIconModule, MatButtonModule, MatToolbarModule, RouterModule, MatMenuModule],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.scss'
})
export class navbarComponent {

}
