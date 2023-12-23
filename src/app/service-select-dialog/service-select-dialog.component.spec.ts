import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ServiceSelectDialogComponent } from './service-select-dialog.component';

describe('ServiceSelectDialogComponent', () => {
  let component: ServiceSelectDialogComponent;
  let fixture: ComponentFixture<ServiceSelectDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ServiceSelectDialogComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ServiceSelectDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
