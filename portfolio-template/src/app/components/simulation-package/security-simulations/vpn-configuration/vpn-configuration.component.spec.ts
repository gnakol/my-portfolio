import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VpnConfigurationComponent } from './vpn-configuration.component';

describe('VpnConfigurationComponent', () => {
  let component: VpnConfigurationComponent;
  let fixture: ComponentFixture<VpnConfigurationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [VpnConfigurationComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(VpnConfigurationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
