import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FileMetadataDialogComponent } from './file-metadata-dialog.component';

describe('FileMetadataDialogComponent', () => {
  let component: FileMetadataDialogComponent;
  let fixture: ComponentFixture<FileMetadataDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FileMetadataDialogComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FileMetadataDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
