import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AllMediaComponent } from './all-media.component';

describe('AllMediaComponent', () => {
  let component: AllMediaComponent;
  let fixture: ComponentFixture<AllMediaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AllMediaComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AllMediaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
