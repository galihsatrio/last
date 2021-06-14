import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LPembelianComponent } from './l-pembelian.component';

describe('LPembelianComponent', () => {
  let component: LPembelianComponent;
  let fixture: ComponentFixture<LPembelianComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LPembelianComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LPembelianComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
