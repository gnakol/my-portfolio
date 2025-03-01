import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AllTypeExperienceComponent } from './all-type-experience.component';

describe('AllTypeExperienceComponent', () => {
  let component: AllTypeExperienceComponent;
  let fixture: ComponentFixture<AllTypeExperienceComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AllTypeExperienceComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AllTypeExperienceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
