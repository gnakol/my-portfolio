import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MonitoringIntroComponent } from './monitoring-intro.component';

describe('MonitoringIntroComponent', () => {
  let component: MonitoringIntroComponent;
  let fixture: ComponentFixture<MonitoringIntroComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [MonitoringIntroComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MonitoringIntroComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
