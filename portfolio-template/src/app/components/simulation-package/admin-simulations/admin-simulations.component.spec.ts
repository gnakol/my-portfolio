import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminSimulationsComponent } from './admin-simulations.component';

describe('AdminSimulationsComponent', () => {
  let component: AdminSimulationsComponent;
  let fixture: ComponentFixture<AdminSimulationsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AdminSimulationsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AdminSimulationsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
