import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MonitoringCyberWarComponent } from './monitoring-cyber-war.component';

describe('MonitoringCyberWarComponent', () => {
  let component: MonitoringCyberWarComponent;
  let fixture: ComponentFixture<MonitoringCyberWarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [MonitoringCyberWarComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MonitoringCyberWarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
