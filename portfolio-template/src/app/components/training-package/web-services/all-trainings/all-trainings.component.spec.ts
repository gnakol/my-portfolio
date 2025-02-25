import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AllTrainingsComponent } from './all-trainings.component';

describe('AllTrainingsComponent', () => {
  let component: AllTrainingsComponent;
  let fixture: ComponentFixture<AllTrainingsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AllTrainingsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AllTrainingsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
