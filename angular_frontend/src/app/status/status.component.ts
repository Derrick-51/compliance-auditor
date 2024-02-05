import { Component } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-status',
  standalone: true,
  imports: [MatButtonModule, RouterLink],
  templateUrl: './status.component.html',
  styleUrl: './status.component.css'
})
export class StatusComponent {

}
