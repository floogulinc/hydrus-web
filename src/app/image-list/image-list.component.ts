import {
  Component,
  OnInit,
  Input,
  OnChanges,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Output,
  EventEmitter,
  input,
  output,
  effect,
  model,
  computed
} from '@angular/core';
import { HydrusBasicFile, HydrusFile } from '../hydrus-file';
import { AppComponent } from '../app.component';
import { IPageInfo } from '@iharbeck/ngx-virtual-scroller';
import { PhotoswipeService } from '../photoswipe.service';
import { FileInfoSheetComponent } from '../file-info-sheet/file-info-sheet.component';
import { MatBottomSheet } from '@angular/material/bottom-sheet';
import { HydrusFileDownloadService } from '../hydrus-file-download.service';
import { difference, union } from 'set-utilities';

@Component({
  selector: 'app-image-list',
  templateUrl: './image-list.component.html',
  styleUrls: ['./image-list.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ImageListComponent implements OnInit, OnChanges {

  //@Input() files: HydrusBasicFile[] = [];

  files = input.required<HydrusBasicFile[]>()



  //@Output() scrollEnd: EventEmitter<IPageInfo> = new EventEmitter();

  scrollEnd = output<IPageInfo>()


  selected = model<Set<number>>(new Set());

  anySelected = computed(() => this.selected().size > 0)

  shiftSelect = output<number>()

  constructor(
    public appComponent: AppComponent,
    public photoswipe: PhotoswipeService,
    public cdr: ChangeDetectorRef,
    private bottomSheet: MatBottomSheet,
    public downloadService: HydrusFileDownloadService,
  ) {
  }

  scrollElement = this.appComponent.sidenavContent.getElementRef().nativeElement

  ngOnInit() {

  }

  ngOnChanges() {

  }

  vsEnd(event: IPageInfo) {
    if (!(event.endIndex !== this.files()?.length - 1)) {
      this.scrollEnd.emit(event);
    }
  }

  fileClick(event: MouseEvent, file: HydrusBasicFile) {
    event.preventDefault();
    if(event.shiftKey) {
      //this.selectToggle(file);
      this.shiftSelect.emit(file.file_id);
    } else if(event.ctrlKey) {
      this.selectToggle(file);
    } else if(event instanceof PointerEvent && event.pointerType === 'touch' && this.anySelected()) {
      this.selectToggle(file);
    } else {
      this.viewFile(file);
    }

  }

  viewFile(file: HydrusBasicFile) {
    this.photoswipe.openPhotoSwipe(this.files(), file.file_id);
  }

  fileInfo(file: HydrusBasicFile) {
    FileInfoSheetComponent.open(this.bottomSheet, file)
  }

  saveFile(file: HydrusBasicFile) {
    this.downloadService.saveFile(file);
  }

  shareFile(file: HydrusBasicFile) {
    this.downloadService.shareFile(file);
  }

  select(file: HydrusBasicFile) {
    this.selected.update(s => union(s, new Set([file.file_id])))
  }

  deselect(file: HydrusBasicFile) {
    this.selected.update(s => difference(s, new Set([file.file_id])))
  }

  selectToggle(file: HydrusBasicFile) {
    this.selected.update(s => {
      if (s.has(file.file_id)) {
        return difference(s, new Set([file.file_id]));
      } else {
        return union(s, new Set([file.file_id]));
      }
    })
  }




}
