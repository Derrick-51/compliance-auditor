import { CanActivate, Router } from '@angular/router';
import { Injectable } from '@angular/core';
import { LatestAuditService } from '../services/latest-audit.service';
import { ToastrService } from 'ngx-toastr';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError, map, switchMap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class pendingAuditGuard implements CanActivate {

  constructor(
    private latestAuditService: LatestAuditService,
    private toastrService: ToastrService,
    private http: HttpClient,
    private router: Router
  ) {}

  canActivate(): Observable<boolean> {
    return this.http.get<any>('http://localhost:3000/auth/profile', { withCredentials: true }).pipe(
      switchMap(data => {
        const dealershipId = data.id;
        return this.latestAuditService.getLatestAuditForDealership(dealershipId).pipe(
          map(latestAudit => {
            if (latestAudit && latestAudit.finalVerdict === 'Pending') {
              this.toastrService.warning('The submitted audit has not been reviewed yet', 'Pending Review');
              return false;
            } else {
              return true;
            }
          }),
          catchError(() => {
            // Handle error fetching latest audit
            return of(false); // Return observable of false
          })
        );
      }),
      catchError(() => {
        // Handle error fetching user profile
        return of(false); // Return observable of false
      })
    );
  }
}