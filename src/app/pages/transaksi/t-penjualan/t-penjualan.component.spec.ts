import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TPenjualanComponent } from './t-penjualan.component';

describe('TPenjualanComponent', () => {
  let component: TPenjualanComponent;
  let fixture: ComponentFixture<TPenjualanComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TPenjualanComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TPenjualanComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
