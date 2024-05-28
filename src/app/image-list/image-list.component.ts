import {
  Component,
  OnInit,
  Input,
  OnChanges,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Output,
  EventEmitter
} from '@angular/core';
import { HydrusBasicFile, HydrusFile } from '../hydrus-file';
import { AppComponent } from '../app.component';
import { IPageInfo } from '@iharbeck/ngx-virtual-scroller';
import { PhotoswipeService } from '../photoswipe.service';

@Component({
  selector: 'app-image-list',
  templateUrl: './image-list.component.html',
  styleUrls: ['./image-list.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ImageListComponent implements OnInit, OnChanges {

  @Input() files: HydrusBasicFile[] = [];

  @Output() scrollEnd: EventEmitter<IPageInfo> = new EventEmitter();

  constructor(
    public appComponent: AppComponent,
    public photoswipe: PhotoswipeService,
    public cdr: ChangeDetectorRef
    ) { }

  scrollElement = this.appComponent.sidenavContent.getElementRef().nativeElement

  ngOnInit() {

  }

  ngOnChanges() {

  }

  vsEnd(event: IPageInfo) {
    if (!(event.endIndex !== this.files?.length - 1)) {
      this.scrollEnd.emit(event);
    }
  }

}
