import { AbstractControl, ValidationErrors } from '@angular/forms';

const passwordPattern = /(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?~`])/; // Password pattern for strong password

export function strongPasswordValidator(control: AbstractControl): ValidationErrors | null {
  const password = control.value;

  if (!password) {
    return null; // Don't validate empty password
  }

  if (!passwordPattern.test(password)) {
    return { strongPassword: true }; // Error key for strong password validation
  }

  return null; // Password is strong
}
