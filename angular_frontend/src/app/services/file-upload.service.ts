import { Injectable } from '@angular/core';
import { HttpClient, HttpRequest, HttpEvent, HttpErrorResponse } from '@angular/common/http';
import { Observable, catchError, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class FileUploadService {
  private baseUrl = 'http://localhost:3000/api/upload';

  constructor(private http: HttpClient) {}

  upload(file: File, folder: string): Observable<HttpEvent<any>> {
    console.log('Upload initiated');
    
    const formData: FormData = new FormData();
    formData.append(folder, file);
    
    let url = this.baseUrl;
    if (folder) {
      url += `/${folder}`;
    }

    const req = new HttpRequest(
      'POST',
      url,
      formData,
      {
        withCredentials: true,
        responseType: 'text',
      }
    );

    console.log('Request object:', req);
    
    return this.http.request(req).pipe(
      catchError((error: HttpErrorResponse) => {
        if (error.error instanceof ErrorEvent) {
          // A client-side or network error occurred. Handle it accordingly.
          console.error('An error occurred:', error.error.message);
        } else {
          // The backend returned an unsuccessful response code.
          // The response body may contain clues as to what went wrong.
          console.error(
            `Backend returned code ${error.status}, ` +
            `body was: ${error.error}`);
        }
        // Return an observable with a user-facing error message.
        return throwError(
          'Something bad happened; please try again later.');
      })
    );
  }
}