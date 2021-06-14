import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LKartuStokComponent } from './l-kartu-stok.component';

describe('LKartuStokComponent', () => {
  let component: LKartuStokComponent;
  let fixture: ComponentFixture<LKartuStokComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LKartuStokComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LKartuStokComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
