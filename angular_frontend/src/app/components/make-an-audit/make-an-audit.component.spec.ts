import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MakeAnAuditComponent } from './make-an-audit.component';

describe('MakeAnAuditComponent', () => {
  let component: MakeAnAuditComponent;
  let fixture: ComponentFixture<MakeAnAuditComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MakeAnAuditComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(MakeAnAuditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
