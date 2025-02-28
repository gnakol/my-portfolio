import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TrainingTemplateComponent } from './training-template.component';

describe('TrainingTemplateComponent', () => {
  let component: TrainingTemplateComponent;
  let fixture: ComponentFixture<TrainingTemplateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [TrainingTemplateComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TrainingTemplateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
