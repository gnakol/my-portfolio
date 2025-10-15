import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CvShellComponent } from './cv-shell.component';

describe('CvShellComponent', () => {
  let component: CvShellComponent;
  let fixture: ComponentFixture<CvShellComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CvShellComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CvShellComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
