import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OverridePageComponent } from './override-page.component';

describe('OverridePageComponent', () => {
  let component: OverridePageComponent;
  let fixture: ComponentFixture<OverridePageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [OverridePageComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(OverridePageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
