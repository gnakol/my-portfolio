import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CCNARoadmapComponent } from './ccna-roadmap.component';

describe('CCNARoadmapComponent', () => {
  let component: CCNARoadmapComponent;
  let fixture: ComponentFixture<CCNARoadmapComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CCNARoadmapComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CCNARoadmapComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
