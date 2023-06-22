import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { saveAs } from 'file-saver';
import { HydrusBasicFile } from './hydrus-file';
import { HydrusFilesService } from './hydrus-files.service';
import { HydrusVersionService } from './hydrus-version.service';
import { firstValueFrom } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class HydrusFileDownloadService {

  constructor(
    private filesService: HydrusFilesService,
    private snackbar: MatSnackBar,
    private hydrusVersionService: HydrusVersionService
  ) { }

  public canShare = navigator.share && navigator.canShare;

  public async saveFile(hfile: HydrusBasicFile) {
    const hydrusVersion = await firstValueFrom(this.hydrusVersionService.hydrusVersion$);
    if (hydrusVersion.hydrus_version < 532) {
      const snackBarRef = this.snackbar.open('Downloading file...');
      return firstValueFrom(this.filesService.getFileAsFile(hfile)).then(file => {
        saveAs(file);
        snackBarRef.dismiss();
      }, error => {
        snackBarRef.dismiss();
        this.snackbar.open(`Error downloading file: ${error.message}`, undefined, {
          duration: 10000
        });
      });
    } else {
      const url = `${hfile.file_url}&download=true`;
      window.open(url, '_self');
    }
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
