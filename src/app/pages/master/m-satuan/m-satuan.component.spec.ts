import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MSatuanComponent } from './m-satuan.component';

describe('MSatuanComponent', () => {
  let component: MSatuanComponent;
  let fixture: ComponentFixture<MSatuanComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MSatuanComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MSatuanComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
