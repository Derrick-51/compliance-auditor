import { Injectable } from '@angular/core';
import { JwtHelperService } from '@auth0/angular-jwt';

@Injectable({
  providedIn: 'root'
})
export class JwtTokenService {

  constructor(private jwtHelper: JwtHelperService) { }

  getUserIdFromToken(token: string): number | null {
    const decodedToken = this.jwtHelper.decodeToken(token);
    return decodedToken ? decodedToken.id : null;
  }
}
