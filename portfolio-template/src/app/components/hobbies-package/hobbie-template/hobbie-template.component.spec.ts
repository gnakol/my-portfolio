import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HobbieTemplateComponent } from './hobbie-template.component';

describe('HobbieTemplateComponent', () => {
  let component: HobbieTemplateComponent;
  let fixture: ComponentFixture<HobbieTemplateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [HobbieTemplateComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(HobbieTemplateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
