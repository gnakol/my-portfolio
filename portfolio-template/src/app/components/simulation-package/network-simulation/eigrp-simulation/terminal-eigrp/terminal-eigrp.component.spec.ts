import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TerminalEigrpComponent } from './terminal-eigrp.component';

describe('TerminalEigrpComponent', () => {
  let component: TerminalEigrpComponent;
  let fixture: ComponentFixture<TerminalEigrpComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [TerminalEigrpComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TerminalEigrpComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
