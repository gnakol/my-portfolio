import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MediaTemplateComponent } from './media-template.component';

describe('MediaTemplateComponent', () => {
  let component: MediaTemplateComponent;
  let fixture: ComponentFixture<MediaTemplateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [MediaTemplateComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MediaTemplateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
