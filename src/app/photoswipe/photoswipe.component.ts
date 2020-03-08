import { Component, OnInit, Input, ViewChild, ElementRef, ViewEncapsulation } from '@angular/core';
import * as PhotoSwipe from 'photoswipe';
import * as PhotoSwipeUI_Default from "photoswipe/dist/photoswipe-ui-default";
import { HydrusFile } from '../hydrus-file';
//import * as PhotoSwipe from "photoswipe";

@Component({
  selector: 'app-photoswipe',
  templateUrl: './photoswipe.component.html',
  styleUrls: ['./photoswipe.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class PhotoswipeComponent{

  //@Input() items : HydrusFile[] = [];

  @ViewChild('pspel', {static: true})
  public pspElement: ElementRef;

  constructor() { }

}
