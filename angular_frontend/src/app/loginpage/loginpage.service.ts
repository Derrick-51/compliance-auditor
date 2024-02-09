import { Injectable, Component } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class LoginpageService {
  constructor() {}

  submitForm(email: string, password: string) {
    console.log(email, password);
  }
}
