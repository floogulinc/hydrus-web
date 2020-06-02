import { Component, ViewChild, ElementRef, ViewEncapsulation } from '@angular/core';

@Component({
  selector: 'app-photoswipe',
  templateUrl: './photoswipe.component.html',
  styleUrls: ['./photoswipe.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class PhotoswipeComponent{

  @ViewChild('pspel', {static: true})
  public pspElement: ElementRef;

  constructor() { }

}
