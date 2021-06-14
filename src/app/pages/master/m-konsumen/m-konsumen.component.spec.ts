import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MKonsumenComponent } from './m-konsumen.component';

describe('MKonsumenComponent', () => {
  let component: MKonsumenComponent;
  let fixture: ComponentFixture<MKonsumenComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MKonsumenComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MKonsumenComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
