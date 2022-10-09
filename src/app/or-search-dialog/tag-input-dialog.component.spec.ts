import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TagInputDialogComponent } from './or-search-dialog.component';

describe('OrSearchDialogComponent', () => {
  let component: TagInputDialogComponent;
  let fixture: ComponentFixture<TagInputDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TagInputDialogComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TagInputDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
