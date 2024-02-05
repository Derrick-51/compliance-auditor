import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EmailfieldComponent } from './emailfield.component';

describe('EmailfieldComponent', () => {
  let component: EmailfieldComponent;
  let fixture: ComponentFixture<EmailfieldComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EmailfieldComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(EmailfieldComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
