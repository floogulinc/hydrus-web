import { Component, OnInit, Input, ChangeDetectionStrategy, ChangeDetectorRef, OnChanges } from '@angular/core';
import { HydrusFilesService } from '../hydrus-files.service';
import { HydrusFile } from '../hydrus-file';
import { IPageInfo } from 'ngx-virtual-scroller';

@Component({
  selector: 'app-image-list-loader',
  templateUrl: './image-list-loader.component.html',
  styleUrls: ['./image-list-loader.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ImageListLoaderComponent implements OnInit, OnChanges {

  @Input() fileIDs : number[] = [];

  @Input() loadAtOnce?: number = 48;

  loading = false;

  currentFiles: HydrusFile[] = [];

  constructor(public filesService: HydrusFilesService, public cdr: ChangeDetectorRef) { }

  ngOnInit(): void {

  }

  ngOnChanges() {
    this.currentFiles = [];
    this.fetchMore();
  }

  listScrollEnd(event: IPageInfo) {
    if(!((event.endIndex+1 >= this.fileIDs.length) || this.loading)) {
      this.fetchMore();
    }
  }

  fetchMore() {
    this.loading = true;
    this.filesService.getFileMetadata(this.fileIDs.slice(this.currentFiles.length, this.currentFiles.length + this.loadAtOnce)).subscribe((files) => {
      this.currentFiles = this.currentFiles.concat(files);
      this.loading = false;
      this.cdr.markForCheck();
    });
  }

}
