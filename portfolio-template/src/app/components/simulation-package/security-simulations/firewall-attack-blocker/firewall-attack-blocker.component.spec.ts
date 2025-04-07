import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FirewallAttackBlockerComponent } from './firewall-attack-blocker.component';

describe('FirewallAttackBlockerComponent', () => {
  let component: FirewallAttackBlockerComponent;
  let fixture: ComponentFixture<FirewallAttackBlockerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [FirewallAttackBlockerComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FirewallAttackBlockerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
