import { Component, OnInit, Input, ChangeDetectionStrategy, ChangeDetectorRef, OnChanges, input, signal, effect, computed } from '@angular/core';
import { HydrusFilesService } from '../hydrus-files.service';
import { HydrusBasicFile } from '../hydrus-file';
import { IPageInfo } from '@iharbeck/ngx-virtual-scroller';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ErrorService } from '../error.service';
import { first, firstValueFrom } from 'rxjs';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmDialogComponent } from '../confirm-dialog/confirm-dialog.component';
import { ServiceSelectDialogComponent } from '../service-select-dialog/service-select-dialog.component';
import { getLocalTagServices } from '../hydrus-services';
import { TagInputDialogComponent } from '../tag-input-dialog/tag-input-dialog.component';
import { HydrusTagsService } from '../hydrus-tags.service';

@Component({
  selector: 'app-image-list-loader',
  templateUrl: './image-list-loader.component.html',
  styleUrls: ['./image-list-loader.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ImageListLoaderComponent implements OnInit, OnChanges {

  //@Input() fileIDs: number[] = [];

  fileIDs = input.required<number[]>();

  //@Input() loadAtOnce = 256;

  loadAtOnce = input(256);

  //loading = false;

  loading = signal(false);

  //currentFiles: HydrusBasicFile[] = [];

  currentFiles = signal<HydrusBasicFile[]>([]);

  selected = signal<Set<number>>(new Set());

  numSelected = computed(() => this.selected().size)

  anySelected = computed(() => this.numSelected() > 0)

  constructor(
    public filesService: HydrusFilesService,
    private snackbar: MatSnackBar,
    private dialog: MatDialog,
    private errorService: ErrorService,
    private tagsService: HydrusTagsService
  ) {

  }

  ngOnInit(): void {

  }

  ngOnChanges() {
    this.currentFiles.set([]);
    this.fetchMore();
  }

  listScrollEnd(event: IPageInfo) {
    if (!((event.endIndex + 1 >= this.fileIDs().length) || this.loading())) {
      this.fetchMore();
    }
  }

  fetchMore() {
    this.loading.set(true);
    this.filesService.getFileMetadata(
      this.fileIDs().slice(this.currentFiles().length, this.currentFiles().length + this.loadAtOnce())
    ).subscribe((files) => {
      this.currentFiles.set(this.currentFiles().concat(files));
      this.loading.set(false);
    });
  }

  deselectAll() {
    this.selected.set(new Set())
  }

  selectAll() {
    this.selected.set(new Set(this.fileIDs()))
  }

  async archiveSelected() {
    if (!await ConfirmDialogComponent.confirmPromise(this.dialog, {
      title: 'Archive selected files?',
      description: `This will attempt to archive ${this.numSelected()} files. Any that are already archived will not be changed.`,
    })) return;

    try {
      await firstValueFrom(this.filesService.archiveFiles(Array.from(this.selected())));
      this.snackbar.open(`${this.numSelected()} files archived`, undefined, {
        duration: 2000
      });
    } catch (error) {
      this.errorService.handleHydrusError(error);
    }
  }

  async inboxSelected() {
    if (!await ConfirmDialogComponent.confirmPromise(this.dialog, {
      title: 'Inbox selected files?',
      description: `This will attempt to re-inbox ${this.numSelected()} files. Any that are already in the inbox will not be changed.`,
    })) return;

    try {
      await firstValueFrom(this.filesService.unarchiveFiles(Array.from(this.selected())));
      this.snackbar.open(`${this.numSelected()} files moved to inbox`, undefined, {
        duration: 2000
      });
    } catch (error) {
      this.errorService.handleHydrusError(error);
    }
  }

  async deleteSelected() {
    if (!await ConfirmDialogComponent.confirmPromise(this.dialog, {
      title: 'Delete selected files?',
      description: `This will attempt to delete ${this.numSelected()} files. Any that are already in the trash will not be changed.`,
    })) return;

    try {
      await firstValueFrom(this.filesService.deleteFiles(Array.from(this.selected())));
      this.snackbar.open(`${this.numSelected()} files sent to trash`, undefined, {
        duration: 2000
      });
    } catch (error) {
      this.errorService.handleHydrusError(error);
    }
  }

  async undeleteSelected() {
    if (!await ConfirmDialogComponent.confirmPromise(this.dialog, {
      title: 'Undelete selected files?',
      description: `This will attempt to undelete ${this.numSelected()} files. Any that are not in the trash will not be changed.`,
    })) return;

    try {
      await firstValueFrom(this.filesService.undeleteFiles(Array.from(this.selected())));
      this.snackbar.open(`${this.numSelected()} files removed from trash`, undefined, {
        duration: 2000
      });
    } catch (error) {
      this.errorService.handleHydrusError(error);
    }
  }

  async addTagsToSelected() {
    try {
      const serviceDialog = ServiceSelectDialogComponent.open(this.dialog, {serviceFilter: (services) => getLocalTagServices(services)})
      const service = await firstValueFrom(serviceDialog.afterClosed())
      const tagsDialog = TagInputDialogComponent.open(this.dialog, {
        displayType: 'display',
        enableOrSearch: false,
        enableSystemPredicates: false,
        title: `Add tags to ${service.name} for ${this.numSelected()} files`,
        submitButtonText: 'Add',
      })
      const dialogResult = await firstValueFrom(tagsDialog.afterClosed());
      if (dialogResult) {
        const tags = dialogResult.flat() as string[];
        await firstValueFrom(this.tagsService.addTagsToServiceFileIDs(Array.from(this.selected()), tags, service.service_key));
        this.snackbar.open(`Tag${tags.length === 1 ? '' : 's'} added to ${this.numSelected()} files`, undefined, {
          duration: 2000
        });
      }
    } catch (error) {
      this.errorService.handleHydrusError(error);
    }
  }


  async removeTags() {
    try {
      const serviceDialog = ServiceSelectDialogComponent.open(this.dialog, {serviceFilter: (services) => getLocalTagServices(services)})
      const service = await firstValueFrom(serviceDialog.afterClosed())
      const tagsDialog = TagInputDialogComponent.open(this.dialog, {
        displayType: 'display',
        enableOrSearch: false,
        enableSystemPredicates: false,
        title: `Remove tags from ${service.name} for ${this.numSelected()} files`,
        submitButtonText: 'Remove',
      })
      const dialogResult = await firstValueFrom(tagsDialog.afterClosed());
      if (dialogResult) {
        const tags = dialogResult.flat() as string[];
        await firstValueFrom(this.tagsService.deleteTagsFromLocalServiceFileIDs(Array.from(this.selected()), tags, service.service_key));
        this.snackbar.open(`Tag${tags.length === 1 ? '' : 's'} removed from ${this.numSelected()} files`, undefined, {
          duration: 2000
        });
      }
    } catch (error) {
      this.errorService.handleHydrusError(error);
    }

  }

}
