import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ExperienceTemplateComponent } from './experience-template.component';

describe('ExperienceTemplateComponent', () => {
  let component: ExperienceTemplateComponent;
  let fixture: ComponentFixture<ExperienceTemplateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ExperienceTemplateComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ExperienceTemplateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
