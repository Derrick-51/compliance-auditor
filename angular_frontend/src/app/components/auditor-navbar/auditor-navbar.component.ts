import { Component } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatToolbarModule } from '@angular/material/toolbar';
import { RouterModule } from '@angular/router';
import { MatMenuModule } from '@angular/material/menu';

@Component({
  selector: 'app-auditor-navbar',
  standalone: true,
  imports: [
    MatIconModule,
    MatButtonModule,
    MatToolbarModule,
    RouterModule,
    MatMenuModule,
  ],
  templateUrl: './auditor-navbar.component.html',
  styleUrl: './auditor-navbar.component.scss'
})
export class AuditorNavbarComponent {

}
