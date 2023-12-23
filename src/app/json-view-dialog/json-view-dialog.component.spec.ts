import { ComponentFixture, TestBed } from '@angular/core/testing';

import { JsonViewDialogComponent } from './json-view-dialog.component';

describe('JsonViewDialogComponent', () => {
  let component: JsonViewDialogComponent;
  let fixture: ComponentFixture<JsonViewDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ JsonViewDialogComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(JsonViewDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
