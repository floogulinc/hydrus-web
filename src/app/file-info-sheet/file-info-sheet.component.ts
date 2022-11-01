import { Component, Inject, ChangeDetectionStrategy } from '@angular/core';
import { HydrusBasicFile, HydrusFileType } from '../hydrus-file';
import {MAT_BOTTOM_SHEET_DATA} from '@angular/material/bottom-sheet';
import { HydrusFilesService } from '../hydrus-files.service';
import { saveAs } from 'file-saver';
import { MatSnackBar } from '@angular/material/snack-bar';
import { tagsObjectFromFile } from '../utils/tag-utils';
import { SettingsService } from '../settings.service';
import { BehaviorSubject, filter, map, shareReplay, switchMap } from 'rxjs';
import { MatDialog } from '@angular/material/dialog';
import { SaucenaoDialogComponent } from '../saucenao-dialog/saucenao-dialog.component';
import { SaucenaoService } from '../saucenao.service';
import { HydrusFileDownloadService } from '../hydrus-file-download.service';



function getFileIcon(fileType: HydrusFileType) {
  switch (fileType) {
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

@Component({
  selector: 'app-file-info-sheet',
  templateUrl: './file-info-sheet.component.html',
  styleUrls: ['./file-info-sheet.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FileInfoSheetComponent {

  constructor(
    @Inject(MAT_BOTTOM_SHEET_DATA) public data: {file: HydrusBasicFile},
    private filesService: HydrusFilesService,
    private snackbar: MatSnackBar,
    public settings: SettingsService,
    private dialog: MatDialog,
    private saucenaoService: SaucenaoService,
    public downloadService: HydrusFileDownloadService
  ) { }

  reload$ = new BehaviorSubject(null);

  file$ = this.reload$.pipe(
    switchMap(() => this.filesService.getFileByHash(this.data.file.hash)),
    map(file => {
      const tagMapArray = Object.entries(tagsObjectFromFile(file))
        .filter(([serviceName, statuses]) => statuses[0] && statuses[0].length > 0)
        .map(([serviceName, statuses]) => ({ serviceName, statuses }));

      const fileIcon = getFileIcon(file.file_type);

      const notesMapArray = Object.entries(file.notes).map(([name, value]) => ({ name, value }));

      return {
        ...file,
        tagMapArray,
        fileIcon,
        notesMapArray
      }

    }),
    shareReplay(1),
  )

  ipfsUrl$ = this.file$.pipe(
    filter(file => file.ipfs_multihashes && Object.values(file.ipfs_multihashes).length > 0),
    map(file => `${this.settings.appSettings.ipfsMultihashUrlPrefix}${Object.values(file.ipfs_multihashes)[0]}`)
  )


  reload() {
    this.reload$.next(null);
  }


  navigatorShare = navigator.share;

  hyshareUrl =
    this.settings.appSettings.hyshareUrl && !this.settings.appSettings.hyshareUrl.endsWith('/')
      ? `${this.settings.appSettings.hyshareUrl}/`
      : this.settings.appSettings.hyshareUrl;

  shareUrl(url: string) {
    if (navigator.share) {
      navigator.share({
        url
      });
    }
  }

  saveFile() {
    this.downloadService.saveFile(this.data.file);
  }

  shareFile() {
    this.downloadService.shareFile(this.data.file);
  }

  canSaucenao = this.saucenaoService.canSaucenao && this.saucenaoService.validSaucenaoMime(this.data.file.mime);

  saucenaoLookup() {
    const snackBarRef = this.snackbar.open('Preparing search...');
    this.filesService.getFileAsFile(this.data.file).subscribe(file => {
      SaucenaoDialogComponent.open(this.dialog, {
        urlOrFile: {
          file
        }
      })
      snackBarRef.dismiss();
    }, error => {
      snackBarRef.dismiss();
      this.snackbar.open(`Error downloading file: ${error.message}`, undefined, {
        duration: 10000
      });
    });
  }


  async deleteFile(){
    try {
      await this.filesService.deleteFile(this.data.file.hash).toPromise();
      this.reload();
      this.snackbar.open('File sent to trash', undefined, {
        duration: 2000
      });
    } catch (error) {
      this.snackbar.open(`Error: ${error.message}`, undefined, {
        duration: 2000
      });
    }
  }

  async undeleteFile(){
    try {
      await this.filesService.undeleteFile(this.data.file.hash).toPromise();
      this.reload();
      this.snackbar.open('File removed from trash', undefined, {
        duration: 2000
      });
    } catch (error) {
      this.snackbar.open(`Error: ${error.message}`, undefined, {
        duration: 2000
      });
    }
  }

  async archiveFile(){
    try {
      await this.filesService.archiveFile(this.data.file.hash).toPromise();
      this.reload();
      this.snackbar.open('File archived', undefined, {
        duration: 2000
      });
    } catch (error) {
      this.snackbar.open(`Error: ${error.message}`, undefined, {
        duration: 2000
      });
    }
  }

  async unarchiveFile(){
    try {
      await this.filesService.unarchiveFile(this.data.file.hash).toPromise();
      this.reload();
      this.snackbar.open('File moved to inbox', undefined, {
        duration: 2000
      });
    } catch (error) {
      this.snackbar.open(`Error: ${error.message}`, undefined, {
        duration: 2000
      });
    }
  }

}
