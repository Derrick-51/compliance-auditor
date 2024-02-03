import {Component} from '@angular/core';
import {MatIconModule} from '@angular/material/icon';
import {MatButtonModule} from '@angular/material/button';
import {MatInputModule} from '@angular/material/input';
import {MatFormFieldModule} from '@angular/material/form-field';

@Component({
  selector: 'app-passwordfield',
  standalone: true,
  imports: [
    MatIconModule,
    MatButtonModule,
    MatInputModule,
    MatFormFieldModule,
  ],
  templateUrl: './passwordfield.component.html',
  styleUrl: './passwordfield.component.css'
})
export class PasswordfieldComponent {
  hide = true;
}
