import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LanguageTemplateComponent } from './language-template.component';

describe('LanguageTemplateComponent', () => {
  let component: LanguageTemplateComponent;
  let fixture: ComponentFixture<LanguageTemplateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [LanguageTemplateComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LanguageTemplateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
