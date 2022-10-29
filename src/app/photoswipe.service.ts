import { Injectable } from '@angular/core';
import { HydrusBasicFile, HydrusFileType } from './hydrus-file';

import PhotoSwipe, { PhotoSwipeOptions, SlideData } from 'photoswipe';
import { Platform } from '@angular/cdk/platform';
import Content from 'photoswipe/dist/types/slide/content';
import Slide from 'photoswipe/dist/types/slide/slide';
import { MatBottomSheet } from '@angular/material/bottom-sheet';
import { FileInfoSheetComponent } from './file-info-sheet/file-info-sheet.component';
import { OverlayContainer } from '@angular/cdk/overlay';

function isContentType(content: Content | Slide, type: string) {
  return (content && content.data && content.data.type === type);
}

@Injectable({
  providedIn: 'root'
})
export class PhotoswipeService {

  constructor(
    public platform: Platform,
    private bottomSheet: MatBottomSheet,
    private overlayContainer: OverlayContainer
  ) { }

  openPhotoSwipe(items: HydrusBasicFile[], id: number) {
    const imgindex = items.findIndex(e => e.file_id === id);

    console.log(document.getElementById('photoswipe-container'));

    const options: PhotoSwipeOptions = {
      index: imgindex,
      bgOpacity: 1,
      clickToCloseNonZoomable: false,
      hideAnimationDuration: 0,
      showAnimationDuration: 0,
    }

    const pswp = new PhotoSwipe(options);

    pswp.addFilter('numItems', numItems => {
      return items.length;
    })

    pswp.addFilter('itemData', (itemData, index) => {
      return this.getPhotoSwipeItem(items[index]);
    });

    pswp.addFilter('useContentPlaceholder', (useContentPlaceholder, content) => {
      if(isContentType(content, 'video')) {
        //return true;
      }
      return useContentPlaceholder;
    });

    pswp.on('appendHeavy', (e) => {
      if (isContentType(e.slide, 'video') && !e.slide.isActive) {
        console.log('video!');
        e.preventDefault();
      }
    });

    pswp.on('contentAppend', (e) => {
      if (isContentType(e.content, 'video')) {
        e.preventDefault();
        e.content.isAttached = true;
        e.content.appendImage();
      }
    });

    pswp.on('contentActivate', ({content}) => {
      if (isContentType(content, 'video') && content.element) {
        const element = content.element as HTMLVideoElement
        element.play();
      }
    });

    pswp.on('contentDeactivate', ({content}) => {
      if (isContentType(content, 'video') && content.element) {
        const element = content.element as HTMLVideoElement
        element.pause();
      }
    });

    pswp.on('wheel', (e) => {
      const event = e.originalEvent;
      if(event.ctrlKey) {
        return;
      }
      e.preventDefault();
      if (event.deltaY < 0) { // wheel up
        pswp.prev();
      } else if (event.deltaY > 0) { // wheel down
        pswp.next();
      }
    });

    pswp.on('bindEvents', () => {
      pswp.scrollWrap.onauxclick = (event: MouseEvent) => {
        if (event.button === 1) {
          pswp.close();
        }
      };
    });


    pswp.on('uiRegister', () => {
      pswp.ui.registerElement({
        name: 'download-button',
        order: 8,
        isButton: true,
        tagName: 'button',

        html: '<span class="mat-icon material-icons">info_outlined</span>',

        onInit: (el, pswp) => {

        },
        onClick: (event, el, pswp) => {
          const file = pswp.currSlide.data.file as HydrusBasicFile;
          this.openFileInfoSheet(file);
        }
      });
    });



    pswp.on('contentLoad', (e) => {
      const { content, isLazy } = e;
      const file = content.data.file as HydrusBasicFile;
      console.log(e);

      if(isContentType(content, 'video')) {
        e.preventDefault();

        content.state = 'loading';

        console.log('test')
        //content.element = document.createElement('div');
        //content.element.className = 'pswp-video-container';

        const vid = document.createElement('video');
        vid.src = file.file_url;
        //vid.autoplay = true;
        vid.controls = !this.platform.FIREFOX;
        vid.poster = file.thumbnail_url;
        vid.loop = true;
        vid.className = 'pswp-video';

        content.element = vid;

        content.onLoaded();
      }
      /* if (content.type === 'google-map') {
        // prevent the deafult behavior
        e.preventDefault();

        // Create a container for iframe
        // and assign it to the `content.element` property
        content.element = document.createElement('div');
        content.element.className = 'pswp__google-map-container';

        const iframe = document.createElement('iframe');
        iframe.setAttribute('allowfullscreen', '');
        iframe.src = content.data.googleMapUrl;
        content.element.appendChild(iframe);
      } */
    });


    pswp.init();
  }

  getPhotoSwipeItem(file: HydrusBasicFile): SlideData {
    if (file.file_type === HydrusFileType.Image) {
      return {
        src: file.file_url,
        msrc: file.thumbnail_url,
        width: file.width,
        height: file.height,
        file
      };
    } else if (file.file_type === HydrusFileType.Video) {
      return {
        html: `
        <div id="pswp-video-${file.file_id}" class="pswp-video-container">
        <img src="${file.thumbnail_url}" class="pswp-video-placeholder">
        </div>
        `,
        file,
        type: 'video',
      };
    } else if (file.file_type === HydrusFileType.Audio) {
      return {
        html: `
        <div id="pswp-audio-${file.file_id}" class="pswp-audio-container">
        </div>
        `,
        file
      };
    } else {
      const html = `<div class="pswp__error-msg">
      <img src="${file.thumbnail_url}" class="pswp-error-thumb">
      <p>The file could not be loaded. (type: ${file.mime})</p>
      </div>`;

      return {
        html,
        file
      };
    }
  }

  openFileInfoSheet(file: HydrusBasicFile) {
    this.bottomSheet.open(FileInfoSheetComponent, {
      data: {
        file
      },
      panelClass: 'file-info-panel',
      closeOnNavigation: true
    });
  }
}
