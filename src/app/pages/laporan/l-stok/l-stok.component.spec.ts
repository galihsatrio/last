import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LStokComponent } from './l-stok.component';

describe('LStokComponent', () => {
  let component: LStokComponent;
  let fixture: ComponentFixture<LStokComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LStokComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LStokComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
