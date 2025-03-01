import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RemoveExperienceComponent } from './remove-experience.component';

describe('RemoveExperienceComponent', () => {
  let component: RemoveExperienceComponent;
  let fixture: ComponentFixture<RemoveExperienceComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [RemoveExperienceComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RemoveExperienceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
