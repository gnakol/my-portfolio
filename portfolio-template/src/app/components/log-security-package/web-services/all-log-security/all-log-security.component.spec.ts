import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AllLogSecurityComponent } from './all-log-security.component';

describe('AllLogSecurityComponent', () => {
  let component: AllLogSecurityComponent;
  let fixture: ComponentFixture<AllLogSecurityComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AllLogSecurityComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AllLogSecurityComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
