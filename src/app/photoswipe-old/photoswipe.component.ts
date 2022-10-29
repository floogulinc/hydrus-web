import { Component, ViewChild, ElementRef, ViewEncapsulation } from '@angular/core';
import { Subject } from 'rxjs';

@Component({
  selector: 'app-photoswipe',
  templateUrl: './photoswipe.component.html',
  styleUrls: ['./photoswipe.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class PhotoswipeComponent {

  @ViewChild('pspel', {static: true})
  public pspElement: ElementRef;

  public infoButtonClick$: Subject<boolean> = new Subject();

  constructor() { }

}
