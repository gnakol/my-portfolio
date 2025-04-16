import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddProjectTypeComponent } from './add-project-type.component';

describe('AddProjectTypeComponent', () => {
  let component: AddProjectTypeComponent;
  let fixture: ComponentFixture<AddProjectTypeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AddProjectTypeComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddProjectTypeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
