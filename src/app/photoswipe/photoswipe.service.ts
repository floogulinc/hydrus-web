import { Injectable, ApplicationRef, Injector, ComponentFactoryResolver, ComponentRef, ElementRef } from '@angular/core';
import { PhotoswipeComponent } from './photoswipe.component';
import * as PhotoSwipe from 'photoswipe';
import * as PhotoSwipeUI_Default from 'photoswipe/dist/photoswipe-ui-default';
import { HydrusFile, HydrusFileType } from '../hydrus-file';
import { fromEvent, Observable, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { MatBottomSheet } from '@angular/material/bottom-sheet';
import { FileInfoSheetComponent } from '../file-info-sheet/file-info-sheet.component';
import { Platform } from '@angular/cdk/platform';


@Injectable({
  providedIn: 'root'
})
export class PhotoswipeService {

  private photoswipeComponent: ComponentRef<PhotoswipeComponent>;
  private pspElement: ElementRef;

  ps: PhotoSwipe<{}>;

  public onMouseWheel$: Observable<WheelEvent>;
  public onMouse$: Observable<MouseEvent>;
  public psClose$ = new Subject();

  constructor(
    private applicationRef: ApplicationRef,
    private injector: Injector,
    private resolver: ComponentFactoryResolver,
    private bottomSheet: MatBottomSheet,
    public platform: Platform
    ) {
    this.photoswipeComponent = this.resolver.resolveComponentFactory(PhotoswipeComponent).create(this.injector);
    this.pspElement = this.photoswipeComponent.instance.pspElement;
    this.applicationRef.attachView(this.photoswipeComponent.hostView);
    document.body.appendChild(this.photoswipeComponent.location.nativeElement);

    this.onMouseWheel$ = fromEvent<WheelEvent>(this.photoswipeComponent.location.nativeElement, 'wheel');
    this.onMouse$ = fromEvent<MouseEvent>(this.photoswipeComponent.location.nativeElement, 'auxclick');
  }

  getPhotoSwipeItems(items: HydrusFile[]): PhotoSwipe.Item[] {
    return items.map((i) => this.getPhotoSwipeItem(i));
  }

  getPhotoSwipeItem(file: HydrusFile): PhotoSwipe.Item {
    if (file.file_type === HydrusFileType.Image) {
      return {
        src: file.file_url,
        msrc: file.thumbnail_url,
        w: file.width,
        h: file.height,
        pid: file.file_id
      };
    } else if (file.file_type === HydrusFileType.Video) {
      return {
        html: `
        <div id="pswp-video-${file.file_id}" class="pswp-video-container">
        <img src="${file.thumbnail_url}" class="pswp-video-placeholder">
        </div>
        `,
        pid: file.file_id
      };
    } else if (file.file_type === HydrusFileType.Audio) {
      return {
        html: `
        <div id="pswp-audio-${file.file_id}" class="pswp-audio-container">
        </div>
        `,
        pid: file.file_id
      };
    } else {
      const html = file.has_thumbnail
      ? `<div class="pswp__error-msg">
      <img src="${file.thumbnail_url}" class="pswp-error-thumb">
      <p>The file could not be loaded. (type: ${file.mime})</p>
      </div>`
      : `<div class="pswp__error-msg">
      The file could not be loaded. (type: ${file.mime})
      </div>`;

      return {
        html,
        pid: file.file_id
      };
    }
  }

  public openPhotoSwipe(items: HydrusFile[], id: number) {
    const imgindex = items.findIndex(e => e.file_id === id);

    const ps = new PhotoSwipe(this.pspElement.nativeElement, PhotoSwipeUI_Default, this.getPhotoSwipeItems(items),
    {
      index: imgindex,
      showHideOpacity: false,
      history: true,
      galleryPIDs: true,
      shareEl: false,
      closeOnScroll: false,
      hideAnimationDuration: 0,
      showAnimationDuration: 0,
      clickToCloseNonZoomable: false
    });

    const removeVideos = () => {
      ps.container.querySelectorAll<HTMLVideoElement>('.pswp-video').forEach((video) => {
        video.pause();
        video.removeAttribute('src');
        video.load();
        video.remove();
      });
    };

    const removeAudio = () => {
      ps.container.querySelectorAll<HTMLVideoElement>('.pswp-audio').forEach((audio) => {
        audio.pause();
        audio.removeAttribute('src');
        audio.load();
        audio.remove();
      });
    };

    ps.listen('close', () => {
      this.psClose$.next();
    });
    ps.listen('destroy', () => {
      removeVideos();
      removeAudio();
    });
    ps.listen('beforeChange', () => {
      removeVideos();
      removeAudio();
    });
    ps.listen('afterChange', () => {
      if (ps.currItem.html) {
        const pid = (ps.currItem as PhotoSwipe.Item).pid;
        const vidContainer = ps.container.querySelector<HTMLDivElement>(`#pswp-video-${pid}`);
        const audioContainer = ps.container.querySelector<HTMLDivElement>(`#pswp-audio-${pid}`);
        if (vidContainer) {
          const item = items.find(i => i.file_id === pid);
          const vid = document.createElement('video');
          vid.src = item.file_url;
          vid.autoplay = true;
          vid.controls = !this.platform.FIREFOX;
          vid.poster = item.thumbnail_url;
          vid.loop = true;
          vid.className = 'pswp-video';
          vidContainer.prepend(vid);
        } else if (audioContainer) {
          const item = items.find(i => i.file_id === pid);
          const audio = document.createElement('audio');
          audio.src = item.file_url;
          audio.autoplay = true;
          audio.loop = true;
          audio.controls = true;
          audio.className = 'pswp-audio';
          audioContainer.prepend(audio);
        }
      }
    });
    ps.init();
    this.onMouseWheel$.pipe(takeUntil(this.psClose$)).subscribe((event) => {
      if (event.deltaY < 0) { // wheel up
        ps.prev();
      } else if (event.deltaY > 0) { // wheel down
        ps.next();
      }
    });
    this.onMouse$.pipe(takeUntil(this.psClose$)).subscribe((event) => {
      if (event.button === 1) {
        ps.close();
      }
    });
    this.photoswipeComponent.instance.infoButtonClick$.pipe(takeUntil(this.psClose$)).subscribe(() => {
      const pid = (ps.currItem as PhotoSwipe.Item).pid;
      const item = items.find(i => i.file_id === pid);
      this.bottomSheet.open(FileInfoSheetComponent, {
        data: {
          file: item
        },
        panelClass: 'file-info-panel',
        closeOnNavigation: true
      });

    });
  }

}
