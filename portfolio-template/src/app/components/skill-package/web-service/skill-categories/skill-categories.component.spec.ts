import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SkillCategoriesComponent } from './skill-categories.component';

describe('SkillCategoriesComponent', () => {
  let component: SkillCategoriesComponent;
  let fixture: ComponentFixture<SkillCategoriesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [SkillCategoriesComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SkillCategoriesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
