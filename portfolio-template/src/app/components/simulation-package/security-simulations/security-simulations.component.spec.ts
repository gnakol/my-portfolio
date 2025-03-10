import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SecuritySimulationsComponent } from './security-simulations.component';

describe('SecuritySimulationsComponent', () => {
  let component: SecuritySimulationsComponent;
  let fixture: ComponentFixture<SecuritySimulationsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [SecuritySimulationsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SecuritySimulationsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
