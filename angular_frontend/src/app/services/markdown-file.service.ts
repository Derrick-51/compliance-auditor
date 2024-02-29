import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class MarkdownFileService {

  constructor(private http: HttpClient) { }

  // Read Markdown file
  readMarkdownFile(filePath: string): Observable<string> {
    return this.http.get(filePath, { responseType: 'text' })
      .pipe(
        catchError((error: any) => {
          console.error('Could not find markdown file:', error);
          // Default guidelines displayed if Markdown file not found
          return of('Default guidelines');
        })
      );
  }
}
