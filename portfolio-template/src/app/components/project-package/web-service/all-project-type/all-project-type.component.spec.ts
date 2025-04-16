import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AllProjectTypeComponent } from './all-project-type.component';

describe('AllProjectTypeComponent', () => {
  let component: AllProjectTypeComponent;
  let fixture: ComponentFixture<AllProjectTypeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AllProjectTypeComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AllProjectTypeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
