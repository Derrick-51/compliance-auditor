import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { UserService } from '../services/user.service';
import { Observable } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';
import { ToastrService } from 'ngx-toastr';

@Injectable({
  providedIn: 'root'
})
export class auditorGuard implements CanActivate {

  constructor(
    private userService: UserService,
     private router: Router,
     private http: HttpClient,
     private toastr: ToastrService,
    ) {}

    canActivate(): Observable<boolean> {
      return this.http
        .get<any>('http://localhost:3000/auth/profile', {
          withCredentials: true,
        })
        .pipe(
          switchMap(user => {
            return this.userService.getUser(user.id).pipe(
              switchMap(user => {
                if(user.usertype === 'Auditor') {
                  return [true];
                } else {
                  this.toastr.error('Access to this page is restricted to auditor users!', 'Error');
                  this.router.navigate(['home']); // Redirect to Home Page
                  return [false];
                }
              })
            );
          })
        );
    }
}