import { Component, Inject, OnInit } from '@angular/core';
import { HydrusBasicFile } from '../hydrus-file';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ExifReaderService } from '../exif-reader.service';
import { catchError, from, map, of, shareReplay } from 'rxjs';
import { Tags } from 'exifreader';
import { ErrorService } from '../error.service';

interface FileMetadataDialogData {
  file: HydrusBasicFile
}

@Component({
  selector: 'app-file-metadata-dialog',
  templateUrl: './file-metadata-dialog.component.html',
  styleUrls: ['./file-metadata-dialog.component.scss']
})
export class FileMetadataDialogComponent implements OnInit {

  constructor(
    public dialogRef: MatDialogRef<FileMetadataDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: FileMetadataDialogData,
    private errorService: ErrorService,
    private exifReader: ExifReaderService
  ) { }

  ngOnInit(): void {
  }

  showRaw = false;

  fileMetadata$ = from(this.exifReader.getExifTagsForFile(this.data.file)).pipe(
    catchError((error) => {
      this.errorService.handleHydrusError(error);
      this.dialogRef.close();
      throw error;
    }),
    map(metadata => ({raw: metadata, array: Object.entries(metadata).filter(([name]) => !(name === 'Thumbnail')).map(([name, obj]) => ({...obj, name}))})),
    shareReplay(1)
  )



  static open(dialog: MatDialog, data?: FileMetadataDialogData, config?: MatDialogConfig<FileMetadataDialogData>) {
    return dialog.open<FileMetadataDialogComponent, FileMetadataDialogData>(
      FileMetadataDialogComponent,
      {
        width: '1280px',
        data: {...data},
        ...config
      }
    );
  }

}
