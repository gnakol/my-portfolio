import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AllSkillCategoryComponent } from './all-skill-category.component';

describe('AllSkillCategoryComponent', () => {
  let component: AllSkillCategoryComponent;
  let fixture: ComponentFixture<AllSkillCategoryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AllSkillCategoryComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AllSkillCategoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
