import { ApplicationRef, EnvironmentInjector, Injectable, createComponent } from '@angular/core';
import { HydrusBasicFile, FileCategory } from './hydrus-file';
import PhotoSwipe, { PhotoSwipeOptions, SlideData } from 'photoswipe';
import { Platform } from '@angular/cdk/platform';
import Content from 'photoswipe/dist/types/slide/content';
import Slide from 'photoswipe/dist/types/slide/slide';
import { MatBottomSheet } from '@angular/material/bottom-sheet';
import { FileInfoSheetComponent } from './file-info-sheet/file-info-sheet.component';
import { Location } from '@angular/common';
import { HydrusFileDownloadService } from './hydrus-file-download.service';
import { firstValueFrom, take } from 'rxjs';
import { canOpenInPhotopea, getPhotopeaUrlForFile } from './photopea';
import { SettingsService } from './settings.service';
import { HydrusFilesService } from './hydrus-files.service';
import Psd from "@webtoon/psd";
import { MatButton } from '@angular/material/button';
import { ErrorService } from './error.service';

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
    private location: Location,
    private downloadService: HydrusFileDownloadService,
    private filesService: HydrusFilesService,
    private settingsService: SettingsService,
    private appRef: ApplicationRef,
    private injector: EnvironmentInjector,
    private errorService: ErrorService
  ) { }

  openPhotoSwipe(items: HydrusBasicFile[], id: number) {
    const imgindex = items.findIndex(e => e.file_id === id);

    const processedFiles = new Map<string, SlideData>();

    const options: PhotoSwipeOptions = {
      index: imgindex,
      bgOpacity: 1,
      clickToCloseNonZoomable: false,
      showHideAnimationType: 'none',
      arrowPrev: false,
      arrowNext: false,
      zoom: false,
      close: false,
      //secondaryZoomLevel: 1,
      maxZoomLevel: 2,
      //tapAction: null,
      errorMsg: 'The file cannot be loaded',
    }

    const pswp = new PhotoSwipe(options);

    pswp.addFilter('numItems', numItems => {
      return items.length;
    })

    pswp.addFilter('itemData', (itemData, index) => {
      const file = items[index];
      if(processedFiles.has(file.hash)) {
        return processedFiles.get(file.hash);
      }
      return this.getPhotoSwipeItem(items[index]);
    });

/*     pswp.addFilter('useContentPlaceholder', (useContentPlaceholder, content) => {
      if(isContentType(content, 'video')) {
        //return true;
      }
      return useContentPlaceholder;
    }); */

/*     const _getVerticalDragRatio = (panY) => {
      return (panY - pswp.currSlide.bounds.center.y)
              / (pswp.viewportSize.y / 3);
    } */

/*     pswp.on('verticalDrag', (e) => {
      // triggered when using vertical drag to close gesture
      // can be default prevented
      console.log('verticalDrag', e.panY);
      //pswp.element.classList.add('pswp--ui-visible')
      const drag = 1 - Math.abs(_getVerticalDragRatio(e.panY));
      console.log(drag);
      if(pswp.element.classList.contains('pswp--ui-visible') && drag < 0.95) {
        pswp.element.classList.remove('pswp--ui-visible')
      } else if (!pswp.element.classList.contains('pswp--ui-visible') && drag >= 0.95) {
        pswp.element.classList.add('pswp--ui-visible')
      }
    }); */


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

    pswp.on('tapAction', (e) => {
      if(!pswp.currSlide.content.isImageContent()) {
        e.preventDefault();
      }
    });

    pswp.on('bindEvents', () => {
      pswp.scrollWrap.onauxclick = (event: MouseEvent) => {
        if (event.button === 1) {
          pswp.close();
        }
      };

    });

    pswp.on('keydown', (e) => {
      if (this.bottomSheet._openedBottomSheetRef) {
        e.preventDefault();
      }
    });

    // disable focus trap
    pswp.keyboard._onFocusIn = (e) => {};

    pswp.on('uiRegister', () => {
      pswp.ui.registerElement({
        name: 'info',
        order: 15,
        isButton: true,
        tagName: 'button',
        html: '<span class="mat-icon material-icons">info_outlined</span>',
        onClick: (event, el, pswp) => {
          const file = pswp.currSlide.data.file as HydrusBasicFile;
          this.bottomSheet.open(FileInfoSheetComponent, {
            data: {
              file
            },
            panelClass: 'file-info-panel',
            closeOnNavigation: true
          }).afterDismissed().pipe(take(1)).subscribe(res => {
            if(res) {
              pswp.close();
            }
          });
        }
      });

      pswp.ui.registerElement({
        name: 'custom-close',
        order: 20,
        isButton: true,
        tagName: 'button',
        html: '<span class="mat-icon material-icons">close</span>',
        onClick: 'close'
      });

      pswp.ui.registerElement({
        name: 'download',
        order: 13,
        isButton: true,
        tagName: 'button',
        html: '<span class="mat-icon material-icons">get_app</span>',
        onClick: (event, el, pswp) => {
          const file = pswp.currSlide.data.file as HydrusBasicFile;
          this.downloadService.saveFile(file);
        }
      });

      if(this.downloadService.canShare) {
        pswp.ui.registerElement({
          name: 'share',
          order: 14,
          isButton: true,
          tagName: 'button',
          html: '<span class="mat-icon material-icons">share</span>',
          onClick: (event, el, pswp) => {
            const file = pswp.currSlide.data.file as HydrusBasicFile;
            this.downloadService.shareFile(file);
          }
        });
      }

      pswp.ui.registerElement({
        name: 'zoom-level-indicator',
        order: 6,
        className: 'pswp__zoom-level',
        onInit: (el, pswp) => {
          pswp.on('zoomPanUpdate', (e) => {
            if (e.slide === pswp.currSlide) {
              if(pswp.currSlide.isZoomable()) {
                const pixelRatioZoom = window.devicePixelRatio && window.devicePixelRatio === 1 ? '' :
                  ` (${Math.round(pswp.currSlide.currZoomLevel * window.devicePixelRatio * 100)}%)`;
                el.innerText = `${Math.round(pswp.currSlide.currZoomLevel * 100)}%${pixelRatioZoom}`;
              } else {
                el.innerText = '';
              }

            }
          });
        }
      });
    });

    pswp.addFilter('uiElement', (element, data) => {
      return element;
    });



    pswp.on('contentLoad', (e) => {
      const { content, isLazy } = e;
      const file = content.data.file as HydrusBasicFile;

       if(isContentType(content, 'video')) {
        e.preventDefault();

        content.state = 'loading';

        content.element = document.createElement('div');
        content.element.className = 'pswp-video-container';
        const img = document.createElement('img');
        img.src = file.thumbnail_url;
        img.className = 'pswp-video-placeholder'
        content.element.append(img);
      } else if(isContentType(content, 'audio')) {
        e.preventDefault();

        content.state = 'loading';

        content.element = document.createElement('div');
        content.element.className = 'pswp-audio-container';
      } else if (isContentType(content, 'psd')) {
        e.preventDefault();
        content.element = document.createElement('div');
        content.element.className = 'pswp__content pswp__error-msg-container';

        const errorMsgEl = document.createElement('div');
        errorMsgEl.className = 'pswp__error-msg';
        content.element.appendChild(errorMsgEl);

        const img = document.createElement('img');
        img.src = file.thumbnail_url;
        img.className = 'pswp-error-thumb';
        errorMsgEl.appendChild(img);

        const errorMsgText = document.createElement('div');
        errorMsgText.innerText = `PSD File`;
        errorMsgText.className = 'pswp-error-text';
        errorMsgEl.appendChild(errorMsgText);

        const psdButton = document.createElement('button');
        psdButton.setAttribute('mat-raised-button', '');
        const psdButtonComponent = createComponent(MatButton, {
          environmentInjector: this.injector,
          hostElement: psdButton,
          projectableNodes: [
            [document.createTextNode('Load PSD')]
          ]
        })

        const buttonContainer = document.createElement('div');
        buttonContainer.className = 'pswp-error-text';
        errorMsgEl.appendChild(buttonContainer);
        buttonContainer.appendChild(psdButton);
        this.appRef.attachView(psdButtonComponent.hostView);

        psdButton.addEventListener('click', async (ev) => {
          psdButtonComponent.setInput('disabled', true);
          try {
            errorMsgText.innerText = `Downloading PSD...`;
            const downloadFile = await firstValueFrom(this.filesService.getFileAsFile(file));
            errorMsgText.innerText = `Rendering PSD...`;
            const imgUrl = await this.getPSDFileAsDataURL(downloadFile);
            const data = {
              type: 'image',
              src: imgUrl,
              msrc: file.thumbnail_url,
              width: file.width,
              height: file.height,
              file
            }
            processedFiles.set(file.hash, data);
            pswp.refreshSlideContent(content.index);
          } catch (error) {
            errorMsgText.innerText = `PSD File`;
            this.errorService.handleHydrusError(error)
            console.error(error);
          }
          psdButtonComponent.setInput('disabled', false);
        })

        this.addPhotopeaButton(file, errorMsgEl);


      } else if (isContentType(content, 'unsupported')) {
        e.preventDefault();
        content.element = document.createElement('div');
        content.element.className = 'pswp__content pswp__error-msg-container';

        const errorMsgEl = document.createElement('div');
        errorMsgEl.className = 'pswp__error-msg';
        content.element.appendChild(errorMsgEl);

        const img = document.createElement('img');
        img.src = file.thumbnail_url;
        img.className = 'pswp-error-thumb';
        errorMsgEl.appendChild(img);

        const errorMsgText = document.createElement('div');
        errorMsgText.innerText = `Unsupported Filetype (${file.file_type_string})`;
        errorMsgText.className = 'pswp-error-text';
        errorMsgEl.appendChild(errorMsgText);

        this.addPhotopeaButton(file, errorMsgEl);

      }

    });

    pswp.on('contentActivate', ({content}) => {
      if (isContentType(content, 'video') && content.element) {
        const file = content.data.file as HydrusBasicFile;
        const vid = document.createElement('video');
        vid.src = file.file_url;
        vid.autoplay = this.settingsService.appSettings.mediaAutoplay;
        vid.controls = !this.platform.FIREFOX;
        vid.poster = file.thumbnail_url;
        vid.loop = this.settingsService.appSettings.mediaLoop;
        vid.muted = this.settingsService.appSettings.mediaDefaultMuted;
        vid.className = 'pswp-video pswp-media';
        vid.onloadeddata = (e) => {
          content.onLoaded();
        }
        vid.onerror = (e) => {
          content.onError();
        }
        content.element.prepend(vid);
      } else if (isContentType(content, 'audio') && content.element) {
        const file = content.data.file as HydrusBasicFile;
        const audio = document.createElement('audio');
        audio.src = file.file_url;
        audio.autoplay = this.settingsService.appSettings.mediaAutoplay;
        audio.loop = this.settingsService.appSettings.mediaLoop;
        audio.muted = this.settingsService.appSettings.mediaDefaultMuted;
        audio.controls = true;
        audio.className = 'pswp-audio pswp-media';
        audio.onloadeddata = (e) => {
          content.onLoaded();
        }
        audio.onerror = (e) => {
          content.onError();
        }
        content.element.prepend(audio);
      }
    });

    pswp.addFilter('contentErrorElement', (contentErrorElement, content) => {

      const file = content.data.file as HydrusBasicFile;

      const errorMsgEl = document.createElement('div');
      errorMsgEl.className = 'pswp__error-msg';
      content.element.appendChild(errorMsgEl);

      const img = document.createElement('img');
      img.src = file.thumbnail_url;
      img.className = 'pswp-error-thumb';
      errorMsgEl.appendChild(img);

      const errorMsgText = document.createElement('div');
      errorMsgText.innerText = `The file cannot be loaded (${file.file_type_string})`;
      errorMsgText.className = 'pswp-error-text';
      errorMsgEl.appendChild(errorMsgText);

      return errorMsgEl;
    });

    pswp.on('appendHeavy', (e) => {

    });

    pswp.on('contentAppend', (e) => {

    });

    const handleDestroyMedia = (content: Content) => {
      if ((isContentType(content, 'video') || isContentType(content, 'audio')) && content.element) {
        content.element.querySelectorAll<HTMLMediaElement>('.pswp-media').forEach(media => {
          media.pause();
          media.removeAttribute('src');
          media.load();
          media.remove();
        })
      }
    }

    pswp.on('contentDeactivate', ({content}) => {
      handleDestroyMedia(content);
    });

    pswp.on('contentRemove', ({content}) => {
      handleDestroyMedia(content);
    });

    /* pswp.on('contentDestroy', ({content}) => {

    }); */

    const locSub = this.location.subscribe(e => {
      pswp.close();
    });

    pswp.on('close', () => {
      locSub.unsubscribe();
      if(window.history.state.pswp) {
        window.history.back();
      }
    });

    /* pswp.on('destroy', () => {

    }); */

    //this.location.go(this.location.path() + '#pswp');
    window.history.pushState({pswp: true}, '');

    pswp.init();
  }



  getPhotoSwipeItem(file: HydrusBasicFile): SlideData {

    switch(file.file_category) {
      case FileCategory.Image: {
        return {
          src: file.file_url,
          msrc: file.thumbnail_url,
          width: file.width,
          height: file.height,
          file
        };
      }
      case FileCategory.Video: {
        return {
          file,
          type: 'video',
        };
      }
      case FileCategory.Audio: {
        return {
          file,
          type: 'audio'
        };
      }
      case FileCategory.PSD: {
        return {
          file,
          type: 'psd',
          width: file.width,
          height: file.height
        };
      }
      default: {
        return {
          type: 'unsupported',
          file
        };
      }
    }
  }

  async getPSDFileAsDataURL(file: Blob) {
    const result = await file.arrayBuffer();
    const psdFile = Psd.parse(result);

    console.log(psdFile)

    const canvasElement = document.createElement("canvas");
    canvasElement.width = psdFile.width;
    canvasElement.height = psdFile.height;
    const context = canvasElement.getContext("2d");
    const compositeBuffer = await psdFile.composite();
    const imageData = new ImageData(
      compositeBuffer,
      psdFile.width,
      psdFile.height
    );

    context.putImageData(imageData, 0, 0);

    return canvasElement.toDataURL();
  }

  addPhotopeaButton(file: HydrusBasicFile, element: HTMLElement) {
    if(canOpenInPhotopea(file) && this.settingsService.appSettings.photopeaIntegration) {
      const photopeaButton = document.createElement('a');
      photopeaButton.setAttribute('mat-raised-button', '');
      photopeaButton.target = '_blank';
      photopeaButton.href = getPhotopeaUrlForFile(file);

      const photopeaButtonComponent = createComponent(MatButton, {
        environmentInjector: this.injector,
        hostElement: photopeaButton,
        projectableNodes: [
          [document.createTextNode('Open file in Photopea')]
        ]
      })

      const buttonContainer = document.createElement('div');
      buttonContainer.className = 'pswp-error-text';
      element.appendChild(buttonContainer);
      buttonContainer.appendChild(photopeaButton);

      this.appRef.attachView(photopeaButtonComponent.hostView);
    }
  }

}
