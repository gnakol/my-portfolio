import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MigrationIntroComponent } from './migration-intro.component';

describe('MigrationIntroComponent', () => {
  let component: MigrationIntroComponent;
  let fixture: ComponentFixture<MigrationIntroComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [MigrationIntroComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MigrationIntroComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
