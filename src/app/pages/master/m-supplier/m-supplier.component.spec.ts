import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MSupplierComponent } from './m-supplier.component';

describe('MSupplierComponent', () => {
  let component: MSupplierComponent;
  let fixture: ComponentFixture<MSupplierComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MSupplierComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MSupplierComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
