import { Component, Inject, ChangeDetectionStrategy } from '@angular/core';
import { HydrusBasicFile, HydrusFile, HydrusFileType, HydrusTagService, HydrusTagServiceType } from '../hydrus-file';
import {MatBottomSheetRef, MAT_BOTTOM_SHEET_DATA} from '@angular/material/bottom-sheet';
import { HydrusFilesService } from '../hydrus-files.service';
import { saveAs } from 'file-saver';
import { MatSnackBar } from '@angular/material/snack-bar';
import { tagsObjectFromFile } from '../utils/tag-utils';
import { SettingsService } from '../settings.service';
import { BehaviorSubject, filter, firstValueFrom, map, shareReplay, switchMap } from 'rxjs';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { SaucenaoDialogComponent } from '../saucenao-dialog/saucenao-dialog.component';
import { SaucenaoService } from '../saucenao.service';
import { HydrusFileDownloadService } from '../hydrus-file-download.service';
import { ActivatedRoute, Router } from '@angular/router';
import { HydrusSearchTags } from '../hydrus-tags';
import { HydrusTagsService } from '../hydrus-tags.service';
import { TagInputDialogComponent } from '../tag-input-dialog/tag-input-dialog.component';
import { HydrusServiceType } from '../hydrus-services';



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
    private dialogRef: MatBottomSheetRef<FileInfoSheetComponent>,
    private filesService: HydrusFilesService,
    private tagsService: HydrusTagsService,
    private snackbar: MatSnackBar,
    public settings: SettingsService,
    private dialog: MatDialog,
    private saucenaoService: SaucenaoService,
    public downloadService: HydrusFileDownloadService,
    private router: Router,
  ) {
   }

  LocalTagService = HydrusServiceType.LOCAL_TAG;

  isBrowse = this.router.isActive('/', {paths: 'exact', queryParams: 'ignored', fragment: 'ignored', matrixParams: 'ignored'})

  reload$ = new BehaviorSubject(null);

  processTags(file: HydrusFile): {
    serviceName: string,
    serviceType?: HydrusTagServiceType,
    serviceKey?: string,
    tags: string[]
  }[] {
    if ('tags' in file) {
      return Object.entries(file.tags)
        .filter(([serviceKey, s]) => s.display_tags[0] && s.display_tags[0].length > 0)
        .map(([serviceKey, s]) => ({ serviceName: s.name, serviceType: s.type, serviceKey, tags: s.display_tags[0] }));
    } else {
      return Object.entries(tagsObjectFromFile(file))
        .filter(([serviceName, statuses]) => statuses[0] && statuses[0].length > 0)
        .map(([serviceName, statuses]) => ({ serviceName, tags: statuses[0] }))
    }
  }

  file$ = this.reload$.pipe(
    switchMap(() => this.filesService.getFileByHash(this.data.file.hash)),
    map(file => {
      const tagMapArray = this.processTags(file);

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
    this.filesService.getThumbAsBlob(this.data.file).subscribe(file => {
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
      await firstValueFrom(this.filesService.unarchiveFile(this.data.file.hash));
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

  searchTags(tags: HydrusSearchTags) {
    this.router.navigate(['/'], {queryParams: {'tags': JSON.stringify(tags)}});
    this.dialogRef.dismiss(true)
  }

  addSearchTags(tags: HydrusSearchTags) {
    this.router.navigate(['/'], {queryParams: {'addTags': JSON.stringify(tags)}});
    this.dialogRef.dismiss(true);
  }

  searchSimilarFiles() {
    const tag = `system:similar to ${this.data.file.hash} distance 4`;
    this.router.navigate(['/'], {queryParams: {'tags': JSON.stringify([tag])}});
    this.dialogRef.dismiss(true);
  }

  async deleteTag(tag: string, serviceKey: string) {
    try {
      await firstValueFrom(this.tagsService.deleteTagsFromLocalService(this.data.file.hash, [tag], serviceKey));
      this.reload();
      const snackbarRef = this.snackbar.open('Tag deleted', 'Undo', {
        duration: 5000
      });
      snackbarRef.onAction().subscribe(() => {
        this.addTags([tag], serviceKey);
      })
    } catch (error) {
      this.snackbar.open(`Error: ${error.message}`, undefined, {
        duration: 2000
      });
    }
  }

  async addTagsDialog(serviceKey: string, serviceName: string) {
    const dialog = TagInputDialogComponent.open(this.dialog, {
      displayType: 'display',
      enableOrSearch: false,
      enableSystemPredicates: false,
      title: `Add tags to ${serviceName}`,
      submitButtonText: 'Add',
    })
    const dialogResult = await firstValueFrom(dialog.afterClosed());
    if (dialogResult) {
      const tags = dialogResult.flat() as string[];
      return this.addTags(tags, serviceKey);
    }
  }

  async addTags(tags: string[], serviceKey: string) {
    try {
      await firstValueFrom(this.tagsService.addTagsToService(this.data.file.hash, tags, serviceKey));
      this.reload();
      this.snackbar.open(`Tag${tags.length === 1 ? '' : 's'} added`, undefined, {
        duration: 2000
      });
    } catch (error) {
      this.snackbar.open(`Error: ${error.message}`, undefined, {
        duration: 2000
      });
    }
  }

}
