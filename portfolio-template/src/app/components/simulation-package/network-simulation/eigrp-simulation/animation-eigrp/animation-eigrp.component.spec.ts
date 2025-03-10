import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AnimationEigrpComponent } from './animation-eigrp.component';

describe('AnimationEigrpComponent', () => {
  let component: AnimationEigrpComponent;
  let fixture: ComponentFixture<AnimationEigrpComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AnimationEigrpComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AnimationEigrpComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
