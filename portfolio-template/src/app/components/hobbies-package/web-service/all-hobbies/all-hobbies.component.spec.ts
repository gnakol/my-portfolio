import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AllHobbiesComponent } from './all-hobbies.component';

describe('AllHobbiesComponent', () => {
  let component: AllHobbiesComponent;
  let fixture: ComponentFixture<AllHobbiesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AllHobbiesComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AllHobbiesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
