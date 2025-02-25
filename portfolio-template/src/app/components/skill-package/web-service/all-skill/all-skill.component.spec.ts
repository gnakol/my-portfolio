import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AllSkillComponent } from './all-skill.component';

describe('AllSkillComponent', () => {
  let component: AllSkillComponent;
  let fixture: ComponentFixture<AllSkillComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AllSkillComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AllSkillComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
