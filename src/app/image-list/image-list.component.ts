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
  effect
} from '@angular/core';
import { HydrusBasicFile, HydrusFile } from '../hydrus-file';
import { AppComponent } from '../app.component';
import { IPageInfo } from '@iharbeck/ngx-virtual-scroller';
import { PhotoswipeService } from '../photoswipe.service';
import { FileInfoSheetComponent } from '../file-info-sheet/file-info-sheet.component';
import { MatBottomSheet } from '@angular/material/bottom-sheet';
import { HydrusFileDownloadService } from '../hydrus-file-download.service';

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

  fileInfo(file: HydrusBasicFile) {
    FileInfoSheetComponent.open(this.bottomSheet, file)
  }

  saveFile(file: HydrusBasicFile) {
    this.downloadService.saveFile(file);
  }

  shareFile(file: HydrusBasicFile) {
    this.downloadService.shareFile(file);
  }

}
