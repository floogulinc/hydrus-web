import { Component, Inject, ChangeDetectionStrategy, Injectable } from '@angular/core';
import { HydrusBasicFile, HydrusFile, FileCategory, HydrusTagServiceType } from '../hydrus-file';
import {MatBottomSheetRef, MAT_BOTTOM_SHEET_DATA} from '@angular/material/bottom-sheet';
import { HydrusFilesService } from '../hydrus-files.service';
import { MatLegacySnackBar as MatSnackBar } from '@angular/material/legacy-snack-bar';
import { legacyTagsObjectFromFile } from '../utils/tag-utils';
import { SettingsService } from '../settings.service';
import { BehaviorSubject, filter, firstValueFrom, map, shareReplay, switchMap } from 'rxjs';
import { MatLegacyDialog as MatDialog } from '@angular/material/legacy-dialog';
import { SaucenaoDialogComponent } from '../saucenao-dialog/saucenao-dialog.component';
import { SaucenaoService } from '../saucenao.service';
import { HydrusFileDownloadService } from '../hydrus-file-download.service';
import { Router } from '@angular/router';
import { HydrusSearchTags } from '../hydrus-tags';
import { HydrusTagsService } from '../hydrus-tags.service';
import { TagInputDialogComponent } from '../tag-input-dialog/tag-input-dialog.component';
import { NoteEditDialogComponent } from '../note-edit-dialog/note-edit-dialog.component';
import { HydrusNotesService } from '../hydrus-notes.service';
import { AddUrlOptions, HydrusUrlService } from '../hydrus-url.service';
import { UrlEditDialogComponent } from '../url-edit-dialog/url-edit-dialog.component'
import { HydrusRatingsService } from '../hydrus-ratings.service';
import { JsonViewDialogComponent } from '../json-view-dialog/json-view-dialog.component';
import { ExifReaderService } from '../exif-reader.service';
import { FileMetadataDialogComponent } from '../file-metadata-dialog/file-metadata-dialog.component';
import { isNumericalRatingService, isLikeRatingService, isIncDecRatingService, HydrusRating } from '../hydrus-rating';
import { HydrusServiceType } from '../hydrus-services';
import { TagSiblingsParentsDialogComponent } from '../tag-siblings-parents-dialog/tag-siblings-parents-dialog.component';
import { HydrusVersionService } from '../hydrus-version.service';
import { ErrorService } from '../error.service';

function getFileIcon(fileType: FileCategory) {
  switch (fileType) {
    case FileCategory.Image: {
      return 'image';
    }
    case FileCategory.Video: {
      return 'movie';
    }
    case FileCategory.Audio: {
      return 'music_note';
    }
    default: {
      return 'insert_drive_file';
    }
  }
}

interface TagServiceItem {
  serviceName: string;
  tags: string[];
  serviceType?: HydrusTagServiceType;
  serviceKey?: string;
}

@Injectable({
  providedIn: 'root'
})
class FileInfoSheetService {

  constructor() { }

  public showStorageTags = false;
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
    private notesService: HydrusNotesService,
    public fileInfoSheetService: FileInfoSheetService,
    private urlService: HydrusUrlService,
    private ratingsService: HydrusRatingsService,
    private exifReader: ExifReaderService,
    private errorService: ErrorService
  ) {
   }

  LocalTagService = HydrusServiceType.LOCAL_TAG;

  isBrowse = this.router.isActive('/', {paths: 'exact', queryParams: 'ignored', fragment: 'ignored', matrixParams: 'ignored'})

  reload$ = new BehaviorSubject(null);

  isNumericalRatingService = isNumericalRatingService;
  isLikeRatingService = isLikeRatingService;
  isIncDecRatingService = isIncDecRatingService;

  hasServiceKey(obj: any): obj is {service_key: string} {
    return !!obj.service_key
  }

  canGetSiblingsParents$ = this.tagsService.canGetSiblingsParents$;

  processTags(file: HydrusFile): {
    displayTags: TagServiceItem[],
    storageTags?: TagServiceItem[]
  } {
    if ('tags' in file) {
      return {
        displayTags: Object.entries(file.tags)
          .filter(([serviceKey, s]) => s.display_tags[0] && s.display_tags[0].length > 0)
          .map(([serviceKey, s]) => ({ serviceKey, serviceName: s.name, serviceType: s.type, tags: s.display_tags[0] })),
        storageTags: Object.entries(file.tags)
          .map(([serviceKey, s]) => ({ serviceKey, serviceName: s.name, serviceType: s.type, tags: s.storage_tags[0] ?? [] }))
      }
    } else {
      return {
        displayTags: Object.entries(legacyTagsObjectFromFile(file))
          .filter(([serviceName, statuses]) => statuses[0] && statuses[0].length > 0)
          .map(([serviceName, statuses]) => ({ serviceName, tags: statuses[0] }))
      }
    }
  }

  file$ = this.reload$.pipe(
    switchMap(() => this.filesService.getFileByHash(this.data.file.hash)),
    map(file => {
      const tags = this.processTags(file);

      const fileIcon = getFileIcon(file.file_category);

      const notesMapArray = file.notes ? Object.entries(file.notes).map(([name, value]) => ({ name, value })) : [];

      return {
        ...file,
        ...tags,
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

  trackByTagService(index: number, item: TagServiceItem) {
    return item.serviceKey ?? item.serviceName;
  }

  trackByNote(index: number, item: { name: string, value: string }) {
    return item.name;
  }

  trackByRating(index: number, rating: HydrusRating) {
    return rating.service_key;
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

  canSaucenao = this.saucenaoService.canSaucenao && this.saucenaoService.validSaucenaoFile(this.data.file);

  saucenaoLookup() {
    const addUrlOptions: AddUrlOptions = {};
    if (this.settings.appSettings.sendDefaultPage !== '') {
      addUrlOptions.destination_page_name = this.settings.appSettings.sendDefaultPage;
    }
    const snackBarRef = this.snackbar.open('Preparing search...');
    this.filesService.getThumbAsBlob(this.data.file).subscribe(file => {
      SaucenaoDialogComponent.open(this.dialog, {
        urlOrFile: {
          file
        },
        addUrlOptions
      })
      snackBarRef.dismiss();
    }, error => {
      snackBarRef.dismiss();
      this.errorService.handleHydrusError(error, 'Error downloading file')
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
      this.errorService.handleHydrusError(error);
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
      this.errorService.handleHydrusError(error);
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
      this.errorService.handleHydrusError(error);
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
      this.errorService.handleHydrusError(error);
    }
  }

  searchTags(tags: HydrusSearchTags) {
    this.dialogRef.dismiss(true);
    this.router.navigate(['/'], {queryParams: {'tags': JSON.stringify(tags)}});
  }

  addSearchTags(tags: HydrusSearchTags) {
    this.dialogRef.dismiss(true);
    this.router.navigate(['/'], {queryParams: {'addTags': JSON.stringify(tags)}});
  }

  searchSimilarFiles() {
    this.dialogRef.dismiss(true);
    const tag = `system:similar to ${this.data.file.hash} distance 4`;
    this.router.navigate(['/'], {queryParams: {'tags': JSON.stringify([tag])}});
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
      this.errorService.handleHydrusError(error);
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
      this.errorService.handleHydrusError(error);
    }
  }

  async tagSiblingsParentsDialog(tag: string) {
    const dialog = TagSiblingsParentsDialogComponent.open(this.dialog, {
      tag,
      allowSearchTag: true,
      allowAddTagToSearch: true,
      allowNewSiblingParentDialog: true
    });
    const dialogResult = await firstValueFrom(dialog.afterClosed());
    if (dialogResult) {
      switch (dialogResult.action) {
        case 'searchTag':
          return this.searchTags([dialogResult.tag])
        case 'addSearchTag':
          return this.addSearchTags([dialogResult.tag]);
        case 'newSiblingParentDialog':
          return this.tagSiblingsParentsDialog(dialogResult.tag)
      }
    }
  }

  async addNoteDialog() {
    const dialog = NoteEditDialogComponent.open(this.dialog);
    const dialogResult = await firstValueFrom(dialog.afterClosed());
    if(dialogResult) {
      try {
        await firstValueFrom(this.notesService.addNote(this.data.file.hash, dialogResult.noteName, dialogResult.noteContent));
        this.reload();
        this.snackbar.open(`Note added`, undefined, {
          duration: 2000
        });
      } catch (error) {
        this.errorService.handleHydrusError(error);
      }
    }
  }

  async editNoteDialog(noteName: string, noteContent: string) {
    const dialog = NoteEditDialogComponent.open(this.dialog, {noteName, noteContent});
    const dialogResult = await firstValueFrom(dialog.afterClosed());
    if(dialogResult) {
      if(dialogResult.noteName !== noteName) {
        try {
          await firstValueFrom(this.notesService.deleteNote(this.data.file.hash, noteName))
        } catch (error) {
          this.snackbar.open(`Error: ${error.error ?? error.message}`, undefined, {
            duration: 2000
          });
          return;
        }
      }
      return this.setNote(dialogResult.noteName, dialogResult.noteContent, 'Note Edited')
    }
  }

  async setNote(noteName: string, noteContent: string, message: string) {
    try {
      await firstValueFrom(this.notesService.setNote(this.data.file.hash, noteName, noteContent));
      this.reload();
      this.snackbar.open(message, undefined, {
        duration: 2000
      });
    } catch(error) {
      this.errorService.handleHydrusError(error);
    }
  }

  async deleteNote(noteName: string, noteContent: string) {
    try {
      await firstValueFrom(this.notesService.deleteNote(this.data.file.hash, noteName))
      this.reload();
      const snackbarRef = this.snackbar.open('Note deleted', 'Undo', {
        duration: 5000
      });
      snackbarRef.onAction().subscribe(() => {
        this.setNote(noteName, noteContent, 'Note Restored')
      })
    } catch (error) {
      this.errorService.handleHydrusError(error);
    }
  }

  async addUrl(url: string) {
    try {
      await firstValueFrom(this.urlService.associateUrl(this.data.file.hash, url));
      this.reload();
      this.snackbar.open(`URL added`, undefined, {
        duration: 2000
      });
    } catch (error) {
      console.log(error);
      this.errorService.handleHydrusError(error);
    }
  }

  async addUrlDialog() {
    const dialog = UrlEditDialogComponent.open(this.dialog);
    const dialogResult = await firstValueFrom(dialog.afterClosed());
    if(dialogResult) {
      return this.addUrl(dialogResult.url);
    }
  }

  async deleteUrl(url: string) {
    try {
      await firstValueFrom(this.urlService.deleteUrl(this.data.file.hash, url));
      this.reload();
      const snackbarRef = this.snackbar.open('URL deleted', 'Undo', {
        duration: 5000
      });
      snackbarRef.onAction().subscribe(() => {
        this.addUrl(url);
      })
    } catch (error) {
      this.errorService.handleHydrusError(error);
    }
  }

  async editUrl(oldUrl: string, newUrl: string) {
    try {
      await firstValueFrom(this.urlService.replaceUrl(this.data.file.hash, oldUrl, newUrl));
      this.reload();
      this.snackbar.open(`URL edited`, undefined, {
        duration: 2000
      });
    } catch (error) {
      this.errorService.handleHydrusError(error);
    }
  }

  async editUrlDialog(url: string) {
    const dialog = UrlEditDialogComponent.open(this.dialog, {url});
    const dialogResult = await firstValueFrom(dialog.afterClosed());
    if(dialogResult) {
      return this.editUrl(url, dialogResult.url);
    }
  }

  async setRating(rating: {service_key: string}, value: number | boolean | null) {
    try {
      await firstValueFrom(this.ratingsService.setRating(this.data.file.hash, rating.service_key, value))
      this.reload();
      this.snackbar.open(`Rating changed`, undefined, {
        duration: 2000
      });
    } catch (error) {
      this.reload();
      this.errorService.handleHydrusError(error);
    }
  }

  async rawInfo() {
    const snackBarRef = this.snackbar.open('Getting file info...');
    const json = await firstValueFrom(this.filesService.getRawFileMetadata(this.data.file.hash));
    snackBarRef.dismiss();
    JsonViewDialogComponent.open(this.dialog, {json, title: "Raw file data"});
  }

  canGetMetadata = this.exifReader.canReadExif(this.data.file);

  async fileMetadata() {
    FileMetadataDialogComponent.open(this.dialog, {file: this.data.file});
  }

}
