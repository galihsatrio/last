import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MRoleComponent } from './m-role.component';

describe('MRoleComponent', () => {
  let component: MRoleComponent;
  let fixture: ComponentFixture<MRoleComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MRoleComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MRoleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
