import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AllEstablishmentComponent } from './all-establishment.component';

describe('AllEstablishmentComponent', () => {
  let component: AllEstablishmentComponent;
  let fixture: ComponentFixture<AllEstablishmentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AllEstablishmentComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AllEstablishmentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
