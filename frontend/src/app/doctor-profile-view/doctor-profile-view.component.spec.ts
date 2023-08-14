import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DoctorProfileViewComponent } from './doctor-profile-view.component';

describe('DoctorProfileViewComponent', () => {
  let component: DoctorProfileViewComponent;
  let fixture: ComponentFixture<DoctorProfileViewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DoctorProfileViewComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DoctorProfileViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
