import { Component, OnInit, Input, ViewChild, OnChanges, ChangeDetectionStrategy, ChangeDetectorRef, Output, EventEmitter } from '@angular/core';
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

  //@Input() fileIDs : number[] = [];

  //@ViewChild(PhotoswipeComponent, {static: true})
  //photoswipe: PhotoswipeComponent;

  @Input() files: HydrusFile[] = [];

  //loading: boolean = false;


  @Output() scrollEnd: EventEmitter<IPageInfo> = new EventEmitter();

  constructor(
    public appComponent: AppComponent,
    public photoswipe : PhotoswipeService,
    public cdr: ChangeDetectorRef
    ) { }

  ngOnInit() {

  }

  ngOnChanges() {

  }

  vsEnd(event: IPageInfo) {
    if (!(event.endIndex !== this.files.length-1)) {
      this.scrollEnd.emit(event);
    }
  }

  public scrollTrackByFunction(index: number, file: HydrusFile): number {
    return file.file_id;
  }

}
