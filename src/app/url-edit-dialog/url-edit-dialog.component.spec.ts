import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UrlEditDialogComponent } from './url-edit-dialog.component';

describe('UrlEditDialogComponent', () => {
  let component: UrlEditDialogComponent;
  let fixture: ComponentFixture<UrlEditDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UrlEditDialogComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UrlEditDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
