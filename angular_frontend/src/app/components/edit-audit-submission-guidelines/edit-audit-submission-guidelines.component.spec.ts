import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditAuditSubmissionGuidelinesComponent } from './edit-audit-submission-guidelines.component';

describe('EditAuditSubmissionGuidelinesComponent', () => {
  let component: EditAuditSubmissionGuidelinesComponent;
  let fixture: ComponentFixture<EditAuditSubmissionGuidelinesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EditAuditSubmissionGuidelinesComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(EditAuditSubmissionGuidelinesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
