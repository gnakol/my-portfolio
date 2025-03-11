import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IntroDhcpComponent } from './intro-dhcp.component';

describe('IntroDhcpComponent', () => {
  let component: IntroDhcpComponent;
  let fixture: ComponentFixture<IntroDhcpComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [IntroDhcpComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(IntroDhcpComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
