import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';
import { ToastrService } from 'ngx-toastr';
import { CampaignService } from '../services/campaign.service';
import { AuditService } from '../services/audit.service';

@Injectable({
  providedIn: 'root'
})
export class pendingAuditGuard implements CanActivate {

  constructor(
     private router: Router,
     private http: HttpClient,
     private toastr: ToastrService,
     private campaignService: CampaignService,
     private auditService: AuditService,
    ) {}

    canActivate(): Observable<boolean> {
      return this.http
        .get<any>('http://localhost:3000/auth/profile', {
          withCredentials: true,
        })
        .pipe(
          switchMap(user => {
            return this.campaignService.getLatestCampaign().pipe(
              switchMap(latestCampaign => {
                return this.auditService.getAuditByUserAndCampaign(user.id, latestCampaign.campaignID).pipe(
                  switchMap(audit => {
                    if(!audit) {
                      return [true]; // Return true if audit is null
                    } else if(!(audit.finalVerdict === 'Pending')) {
                      return [true];
                    } else {
                      this.toastr.error(
                        `Cannot make another audit! Please wait for the
                        last submitted audit to be reviewed by an auditor`, 'Error'
                      );
                      this.router.navigate(['status']); // Redirect to Status Page
                      return [false];
                    }
                  })
                );
              })
            );
          })
        );
    }
}