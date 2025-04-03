import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ContactTemplateComponent } from './contact-template.component';

describe('ContactTemplateComponent', () => {
  let component: ContactTemplateComponent;
  let fixture: ComponentFixture<ContactTemplateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ContactTemplateComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ContactTemplateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
