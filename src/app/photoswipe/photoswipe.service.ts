import { Injectable, ApplicationRef, Injector, ComponentFactoryResolver, ComponentRef, ElementRef } from '@angular/core';
import { PhotoswipeComponent } from './photoswipe.component';
import * as PhotoSwipe from 'photoswipe';
import * as PhotoSwipeUI_Default from 'photoswipe/dist/photoswipe-ui-default';
import { HydrusFile } from '../hydrus-file';

@Injectable({
  providedIn: 'root'
})
export class PhotoswipeService {

  constructor(private applicationRef: ApplicationRef, private injector: Injector, private resolver: ComponentFactoryResolver) {
    this.photoswipeComponent = this.resolver.resolveComponentFactory(PhotoswipeComponent).create(this.injector);
    this.pspElement = this.photoswipeComponent.instance.pspElement;
    this.applicationRef.attachView(this.photoswipeComponent.hostView);
    document.body.appendChild(this.photoswipeComponent.location.nativeElement);
  }

  private photoswipeComponent: ComponentRef<PhotoswipeComponent>;
  private pspElement: ElementRef;

  ps: PhotoSwipe<{}>;

  getPhotoSwipeItems(items : HydrusFile[]) : PhotoSwipe.Item[] {
    return items.map((i) => this.getPhotoSwipeItem(i));
  }

  getPhotoSwipeItem(file: HydrusFile) : PhotoSwipe.Item {
    return {
      src: file.file_url,
      msrc: file.thumbnail_url,
      w: file.width,
      h: file.height
    };
  }

  public openPhotoSwipe(items : HydrusFile[], id: number) {
    console.log(id);

    let imgindex = items.findIndex(e => e.file_id == id);
    console.log(imgindex);

    let ps = new PhotoSwipe(this.pspElement.nativeElement, PhotoSwipeUI_Default, this.getPhotoSwipeItems(items),
    {
      index: imgindex,
      showHideOpacity: false,
      history: false,
      shareEl: false,
      closeOnScroll: false,
      hideAnimationDuration:0,
      showAnimationDuration:0
    });
    ps.init();
  }

}
