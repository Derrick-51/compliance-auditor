import { CanActivateFn } from '@angular/router';

export const submitAuditGuard: CanActivateFn = (route, state) => {
  // Check if the error message exists in the component
  const errorMessageExists = document.querySelector('.text-red-500') !== null;
  
  // Return false if the error message exists, preventing navigation to the status page
  return !errorMessageExists;
};
