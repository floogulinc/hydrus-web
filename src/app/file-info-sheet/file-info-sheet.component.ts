import { Component, OnInit, Inject } from '@angular/core';
import { HydrusBasicFile, HydrusFile, HydrusFileType, ServiceNamesToStatusesToTags } from '../hydrus-file';
import {MAT_BOTTOM_SHEET_DATA} from '@angular/material/bottom-sheet';
import { HydrusFilesService } from '../hydrus-files.service';
import { saveAs } from 'file-saver';
import { MatSnackBar } from '@angular/material/snack-bar';
import { tagsObjectFromFile } from '../utils/tag-utils';
import { SettingsService } from '../settings.service';
import { BehaviorSubject, filter, map, shareReplay, switchMap } from 'rxjs';

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
  styleUrls: ['./file-info-sheet.component.scss']
})
export class FileInfoSheetComponent {

  Object = Object;

  constructor(
    @Inject(MAT_BOTTOM_SHEET_DATA) public data: {file: HydrusBasicFile},
    private filesService: HydrusFilesService,
    private snackbar: MatSnackBar,
    public settings: SettingsService,
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
  navigatorCanShare = navigator.canShare;

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
