import { ComponentFixture, TestBed } from '@angular/core/testing';
import { homeNavbarComponent } from './navbar.component';

describe('NavbarComponent', () => {
  let component: homeNavbarComponent;
  let fixture: ComponentFixture<homeNavbarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [homeNavbarComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(homeNavbarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
