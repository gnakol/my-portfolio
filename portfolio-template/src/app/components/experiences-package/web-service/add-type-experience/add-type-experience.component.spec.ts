import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddTypeExperienceComponent } from './add-type-experience.component';

describe('AddTypeExperienceComponent', () => {
  let component: AddTypeExperienceComponent;
  let fixture: ComponentFixture<AddTypeExperienceComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AddTypeExperienceComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddTypeExperienceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
