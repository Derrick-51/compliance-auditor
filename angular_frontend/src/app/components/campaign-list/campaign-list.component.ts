import { Component } from '@angular/core';
import { AuditorNavbarComponent } from '../auditor-navbar/auditor-navbar.component';

@Component({
  selector: 'app-campaign-list',
  standalone: true,
  imports: [AuditorNavbarComponent],
  templateUrl: './campaign-list.component.html',
  styleUrl: './campaign-list.component.scss'
})
export class CampaignListComponent {

}
