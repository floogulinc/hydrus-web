import { Component, OnInit, Input, ViewChild, ElementRef } from '@angular/core';
import * as PhotoSwipe from 'photoswipe';
import * as PhotoSwipeUI_Default from "photoswipe/dist/photoswipe-ui-default";
import { HydrusFile } from '../hydrus-file';
//import * as PhotoSwipe from "photoswipe";

@Component({
  selector: 'app-photoswipe',
  templateUrl: './photoswipe.component.html',
  styleUrls: ['./photoswipe.component.scss']
})
export class PhotoswipeComponent implements OnInit {

  @Input() items : HydrusFile[] = [];

  @ViewChild('pspel', {static: true})
  private pspElement: ElementRef;

  //ps: PhotoSwipe<{}>;

  getPhotoSwipeItems() : PhotoSwipe.Item[] {
    return this.items.map((i) => this.getPhotoSwipeItem(i));
  }

  getPhotoSwipeItem(file: HydrusFile) {
    return {
      src: file.file_url,
      w: file.width,
      h: file.height
    }
  }

  constructor() { }

  ngOnInit() {
    //this.ps = new PhotoSwipe(this.pspElement.nativeElement, PhotoSwipeUI_Default, this.items, {});
  }

  ngOnChanges() {
    //this.ps.

  }

  ps : PhotoSwipe<{}>;

  public openPhotoSwipe(id: number) {
    console.log(id);

    let imgindex = this.items.findIndex(e => e.file_id == id);
    console.log(imgindex);

    let ps = new PhotoSwipe(this.pspElement.nativeElement, PhotoSwipeUI_Default, this.getPhotoSwipeItems(), {index: imgindex, showHideOpacity: true, history: false});
    ps.init();
    //ps.goTo(imgindex);
  }

}
