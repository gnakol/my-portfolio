import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProtectSystemComponent } from './protect-system.component';

describe('ProtectSystemComponent', () => {
  let component: ProtectSystemComponent;
  let fixture: ComponentFixture<ProtectSystemComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ProtectSystemComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProtectSystemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
