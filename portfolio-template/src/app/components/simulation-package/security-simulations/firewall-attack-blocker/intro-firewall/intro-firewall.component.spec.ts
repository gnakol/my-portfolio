import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IntroFirewallComponent } from './intro-firewall.component';

describe('IntroFirewallComponent', () => {
  let component: IntroFirewallComponent;
  let fixture: ComponentFixture<IntroFirewallComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [IntroFirewallComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(IntroFirewallComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
