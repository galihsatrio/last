import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TPembelianComponent } from './t-pembelian.component';

describe('TPembelianComponent', () => {
  let component: TPembelianComponent;
  let fixture: ComponentFixture<TPembelianComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TPembelianComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TPembelianComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
