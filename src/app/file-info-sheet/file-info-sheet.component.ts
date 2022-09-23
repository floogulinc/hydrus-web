import { Component, OnInit, Inject } from '@angular/core';
import { HydrusFile, HydrusFileType, ServiceNamesToStatusesToTags } from '../hydrus-file';
import {MAT_BOTTOM_SHEET_DATA} from '@angular/material/bottom-sheet';
import { HydrusFilesService } from '../hydrus-files.service';
import { saveAs } from 'file-saver';
import { MatSnackBar } from '@angular/material/snack-bar';
import { tagsObjectFromFile } from '../utils/tag-utils';
import { SettingsService } from '../settings.service';
import { map, shareReplay } from 'rxjs';

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
    @Inject(MAT_BOTTOM_SHEET_DATA) public data: {hash: string},
    private filesService: HydrusFilesService,
    private snackbar: MatSnackBar,
    public settings: SettingsService,
  ) { }

  file$ = this.filesService.getFileByHash(this.data.hash).pipe(
    map(file => {
      const tagMap = Object.entries(tagsObjectFromFile(file))
      .filter(([serviceName, statuses]) => statuses[0] && statuses[0].length > 0)
      .map(([serviceName, statuses]) => ({serviceName, statuses}));

      const fileIcon = getFileIcon(file.file_type);

      return {
        ...file,
        tagMap,
        fileIcon
      }

    }),
    shareReplay(1)
  )





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

  saveFile(file: HydrusFile) {
    const snackBarRef = this.snackbar.open('Downloading file...');
    this.filesService.getFileAsFile(file).subscribe(file => {
      saveAs(file);
      snackBarRef.dismiss();
    }, error => {
      snackBarRef.dismiss();
      this.snackbar.open(`Error downloading file: ${error.message}`, undefined, {
        duration: 10000
      });
    });
  }

  shareFile(file: HydrusFile) {
    const snackBarRef = this.snackbar.open('Sharing file...');
    this.filesService.getFileAsFile(file).toPromise().then(file => {
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
