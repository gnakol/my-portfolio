import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NetworkIntrusionComponent } from './network-intrusion.component';

describe('NetworkIntrusionComponent', () => {
  let component: NetworkIntrusionComponent;
  let fixture: ComponentFixture<NetworkIntrusionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [NetworkIntrusionComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NetworkIntrusionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
