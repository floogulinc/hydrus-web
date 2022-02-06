import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { FileInfoSheetComponent } from './file-info-sheet.component';

describe('FileInfoSheetComponent', () => {
  let component: FileInfoSheetComponent;
  let fixture: ComponentFixture<FileInfoSheetComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ FileInfoSheetComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FileInfoSheetComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
