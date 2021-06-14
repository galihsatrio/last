import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LPenjualanComponent } from './l-penjualan.component';

describe('LPenjualanComponent', () => {
  let component: LPenjualanComponent;
  let fixture: ComponentFixture<LPenjualanComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LPenjualanComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LPenjualanComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
