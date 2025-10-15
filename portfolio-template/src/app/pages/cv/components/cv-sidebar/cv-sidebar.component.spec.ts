import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CvSidebarComponent } from './cv-sidebar.component';

describe('CvSidebarComponent', () => {
  let component: CvSidebarComponent;
  let fixture: ComponentFixture<CvSidebarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CvSidebarComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CvSidebarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
