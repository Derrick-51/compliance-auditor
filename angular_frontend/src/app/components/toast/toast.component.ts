import { Component } from '@angular/core';
import { ToastrService } from 'ngx-toastr'
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-toast',
  standalone: true,
  imports: [MatCardModule, MatButtonModule,],
  templateUrl: './toast.component.html',
  styleUrl: './toast.component.scss'
})
export class ToastComponent {
  constructor(private toastr:ToastrService) {}

  showSuccess() {
    this.toastr.success("Your account was successfully created!", "Account Created")
  }
}

