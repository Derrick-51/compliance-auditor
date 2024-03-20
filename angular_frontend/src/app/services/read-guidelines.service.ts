import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class ReadGuidelinesService {
  private readonly markdownFilePath: string = 'http://localhost:3000/guidelines/audit-submission-guidelines.md';
  constructor(private http: HttpClient) { }

  // Read Markdown file
  readGuidelines(): Observable<string> {
    return this.http.get(this.markdownFilePath, { responseType: 'text' })
      .pipe(
        catchError((error: any) => {
          console.error('Could not find markdown file:', error);
          // Default guidelines displayed if Markdown file not found
          return of('1. Submit the audit with images of brand signage that follow the criteria.\n' +
          '2. Wait for an auditor to review the submitted audit.\n' +
          '3. The verdict of the submitted audit will be displayed on the Status Page.');
        })
      );
  }
}
