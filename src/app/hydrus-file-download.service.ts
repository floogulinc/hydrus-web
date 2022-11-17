import { Injectable } from '@angular/core';
import { MatLegacySnackBar as MatSnackBar } from '@angular/material/legacy-snack-bar';
import { saveAs } from 'file-saver';
import { HydrusBasicFile } from './hydrus-file';
import { HydrusFilesService } from './hydrus-files.service';

@Injectable({
  providedIn: 'root'
})
export class HydrusFileDownloadService {

  constructor(
    private filesService: HydrusFilesService,
    private snackbar: MatSnackBar,
  ) { }

  public canShare = navigator.share && navigator.canShare;

  public saveFile(hfile: HydrusBasicFile) {
    const snackBarRef = this.snackbar.open('Downloading file...');
    return this.filesService.getFileAsFile(hfile).subscribe(file => {
      saveAs(file);
      snackBarRef.dismiss();
    }, error => {
      snackBarRef.dismiss();
      this.snackbar.open(`Error downloading file: ${error.message}`, undefined, {
        duration: 10000
      });
    });
  }

  shareFile(hfile: HydrusBasicFile) {
    const snackBarRef = this.snackbar.open('Sharing file...');
    return this.filesService.getFileAsFile(hfile).toPromise().then(file => {
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
