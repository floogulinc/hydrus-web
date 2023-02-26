import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HydrusVersionDialogComponent } from './hydrus-version-dialog.component';

describe('HydrusVersionDialogComponent', () => {
  let component: HydrusVersionDialogComponent;
  let fixture: ComponentFixture<HydrusVersionDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ HydrusVersionDialogComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(HydrusVersionDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
