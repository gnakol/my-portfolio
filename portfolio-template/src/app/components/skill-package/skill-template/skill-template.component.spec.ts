import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SkillTemplateComponent } from './skill-template.component';

describe('SkillTemplateComponent', () => {
  let component: SkillTemplateComponent;
  let fixture: ComponentFixture<SkillTemplateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [SkillTemplateComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SkillTemplateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
