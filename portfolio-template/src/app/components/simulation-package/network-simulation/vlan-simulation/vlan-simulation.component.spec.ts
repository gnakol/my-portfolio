import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VlanSimulationComponent } from './vlan-simulation.component';

describe('VlanSimulationComponent', () => {
  let component: VlanSimulationComponent;
  let fixture: ComponentFixture<VlanSimulationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [VlanSimulationComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(VlanSimulationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
