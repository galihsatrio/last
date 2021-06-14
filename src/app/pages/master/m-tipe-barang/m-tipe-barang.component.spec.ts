import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MTipeBarangComponent } from './m-tipe-barang.component';

describe('MTipeBarangComponent', () => {
  let component: MTipeBarangComponent;
  let fixture: ComponentFixture<MTipeBarangComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MTipeBarangComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MTipeBarangComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
