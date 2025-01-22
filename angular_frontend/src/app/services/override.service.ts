import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { Images } from '../components/review-audit/audit-list';
@Injectable({
  providedIn: 'root',
})
export class OverrideService {
  private imagesUrl = 'http://localhost:3000/api/evidence';
  constructor(private http: HttpClient) {}

  //This will list all the images under the selected audit from the audit-review page
  getImages(auditID: number): Observable<Images[]> {
    return this.http.get<Images[]>(
      `${this.imagesUrl}/selected-audit/${auditID}`
    );
  }

  //This function will update the image's verdict according to the auditor's review as well as record that the images was overriden
  overrideVerdict(imageID: number, verdict: string): Observable<Images> {
    const url = `${this.imagesUrl}/override-verdict/${verdict}/selected-image/${imageID}`;
    return this.http.patch<Images>(url, { verdict });
  }
}
