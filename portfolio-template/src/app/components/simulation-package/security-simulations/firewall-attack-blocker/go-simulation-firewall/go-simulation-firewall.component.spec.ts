import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GoSimulationFirewallComponent } from './go-simulation-firewall.component';

describe('GoSimulationFirewallComponent', () => {
  let component: GoSimulationFirewallComponent;
  let fixture: ComponentFixture<GoSimulationFirewallComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [GoSimulationFirewallComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GoSimulationFirewallComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
