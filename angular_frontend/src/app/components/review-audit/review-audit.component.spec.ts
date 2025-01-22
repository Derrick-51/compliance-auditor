import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReviewAuditComponent } from './review-audit.component';

describe('ReviewAuditComponent', () => {
  let component: ReviewAuditComponent;
  let fixture: ComponentFixture<ReviewAuditComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ReviewAuditComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ReviewAuditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
