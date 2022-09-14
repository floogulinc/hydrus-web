import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OrSearchDialogComponent } from './or-search-dialog.component';

describe('OrSearchDialogComponent', () => {
  let component: OrSearchDialogComponent;
  let fixture: ComponentFixture<OrSearchDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ OrSearchDialogComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(OrSearchDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
