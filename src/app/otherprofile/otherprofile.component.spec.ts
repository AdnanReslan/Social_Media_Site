import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OtherprofileComponent } from './otherprofile.component';

describe('OtherprofileComponent', () => {
  let component: OtherprofileComponent;
  let fixture: ComponentFixture<OtherprofileComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ OtherprofileComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(OtherprofileComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
