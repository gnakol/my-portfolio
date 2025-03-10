import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PingSimulationsComponent } from './ping-simulations.component';

describe('PingSimulationsComponent', () => {
  let component: PingSimulationsComponent;
  let fixture: ComponentFixture<PingSimulationsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [PingSimulationsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PingSimulationsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
