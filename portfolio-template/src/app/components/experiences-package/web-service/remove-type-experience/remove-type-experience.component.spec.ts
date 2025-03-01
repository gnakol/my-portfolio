import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RemoveTypeExperienceComponent } from './remove-type-experience.component';

describe('RemoveTypeExperienceComponent', () => {
  let component: RemoveTypeExperienceComponent;
  let fixture: ComponentFixture<RemoveTypeExperienceComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [RemoveTypeExperienceComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RemoveTypeExperienceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
