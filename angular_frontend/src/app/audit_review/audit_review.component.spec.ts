import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AuditReviewComponent } from './audit_review.component';

describe('OverrideComponent', () => {
  let component: AuditReviewComponent;
  let fixture: ComponentFixture<AuditReviewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AuditReviewComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(AuditReviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
