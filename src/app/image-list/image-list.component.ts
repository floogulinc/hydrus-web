import { Component, OnInit, Input, ViewChild, OnChanges, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import { HydrusFile } from '../hydrus-file';
import { HydrusFilesService } from '../hydrus-files.service';
import { AppComponent } from '../app.component';
import { IPageInfo } from 'ngx-virtual-scroller';
import { PhotoswipeService } from '../photoswipe/photoswipe.service';

@Component({
  selector: 'app-image-list',
  templateUrl: './image-list.component.html',
  styleUrls: ['./image-list.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ImageListComponent implements OnInit, OnChanges {

  @Input() fileIDs : number[] = [];

  //@ViewChild(PhotoswipeComponent, {static: true})
  //photoswipe: PhotoswipeComponent;

  currentFiles: HydrusFile[] = [];

  loading: boolean = false;

  loadAtOnce: number = 48;

  constructor(
    public filesService: HydrusFilesService,
    public appComponent: AppComponent,
    public photoswipe : PhotoswipeService,
    public cdr: ChangeDetectorRef
    ) { }

  ngOnInit() {

  }

  ngOnChanges() {
    this.currentFiles = [];
    this.fetchMore();
  }

  vsEnd(event: IPageInfo) {
    if (!(((event.endIndex !== this.currentFiles.length-1) || (event.endIndex+1 >= this.fileIDs.length)) || this.loading)) {
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

  public scrollTrackByFunction(index: number, file: HydrusFile): number {
    return file.file_id;
  }

}
