import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ServicesInfoDialogComponent } from './services-info-dialog.component';

describe('ServicesInfoDialogComponent', () => {
  let component: ServicesInfoDialogComponent;
  let fixture: ComponentFixture<ServicesInfoDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ServicesInfoDialogComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ServicesInfoDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
