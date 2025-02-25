import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddTrainingsComponent } from './add-trainings.component';

describe('AddTrainingsComponent', () => {
  let component: AddTrainingsComponent;
  let fixture: ComponentFixture<AddTrainingsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AddTrainingsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddTrainingsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
