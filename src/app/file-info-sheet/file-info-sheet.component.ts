import { Component, OnInit, Inject } from '@angular/core';
import { HydrusFile, HydrusFileType } from '../hydrus-file';
import {MAT_BOTTOM_SHEET_DATA} from '@angular/material/bottom-sheet';
import { TagUtils } from '../tag-utils';
import { HydrusFilesService } from '../hydrus-files.service';
import { saveAs } from 'file-saver';
import { MatSnackBar } from '@angular/material/snack-bar';
import { rejects } from 'assert';

interface ShareData {
  title?: string;
  text?: string;
  url?: string;
  files?: File[];
}

declare global {
  interface Navigator {
      share(data?: ShareData): Promise<void>;
      canShare(data?: ShareData): boolean;
  }
}

@Component({
  selector: 'app-file-info-sheet',
  templateUrl: './file-info-sheet.component.html',
  styleUrls: ['./file-info-sheet.component.scss']
})
export class FileInfoSheetComponent {

  tagUtils = TagUtils;
  Object = Object;

  constructor(
    @Inject(MAT_BOTTOM_SHEET_DATA) public data: {file: HydrusFile},
    private filesService: HydrusFilesService,
    private snackbar: MatSnackBar
  ) { }

  get fileIcon() {
    switch (this.data.file.file_type) {
      case HydrusFileType.Image: {
        return 'photo';
      }
      case HydrusFileType.Video: {
        return 'movie';
      }
      default: {
        return 'insert_drive_file';
      }
    }
  }

  navigatorShare = navigator.share;
  navigatorCanShare = navigator.canShare;

  shareUrl(url: string) {
    if (navigator.share) {
      navigator.share({
        url
      });
    }
  }

  saveFile() {
    const snackBarRef = this.snackbar.open('Downloading file...');
    this.filesService.getFileAsFile(this.data.file).subscribe(file => {
      saveAs(file);
      snackBarRef.dismiss();
    }, error => {
      snackBarRef.dismiss();
      this.snackbar.open(`Error downloading file: ${error.message}`, undefined, {
        duration: 10000
      });
    });
  }

  shareFile() {
    const snackBarRef = this.snackbar.open('Sharing file...');
    this.filesService.getFileAsFile(this.data.file).toPromise().then(file => {
      if (navigator.canShare && navigator.canShare({ files: [file] })) {
        return navigator.share({
          files: [file]
        });
      } else {
        throw new Error('Your browser doesn\'t support sharing this file');
      }
    })
    .then(() => {
      snackBarRef.dismiss();
    }, error => {
      snackBarRef.dismiss();
      if (error.message !== 'Share canceled') {
        this.snackbar.open(`Error sharing file: ${error.message}`, undefined, {
          duration: 10000
        });
      }
    });
  }

}
