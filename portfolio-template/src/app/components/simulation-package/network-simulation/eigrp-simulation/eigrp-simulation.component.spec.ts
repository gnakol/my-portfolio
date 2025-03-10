import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EigrpSimulationComponent } from './eigrp-simulation.component';

describe('EigrpSimulationComponent', () => {
  let component: EigrpSimulationComponent;
  let fixture: ComponentFixture<EigrpSimulationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [EigrpSimulationComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EigrpSimulationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
