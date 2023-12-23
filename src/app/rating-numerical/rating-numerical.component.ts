import { Component, EventEmitter, Input, Output } from '@angular/core';
import { HydrusNumericalRating, HydrusNumericalRatingValue, ratingIcons, ratingIconsOutline } from '../hydrus-rating';

@Component({
  selector: 'app-rating-numerical',
  templateUrl: './rating-numerical.component.html',
  styleUrls: ['./rating-numerical.component.scss']
})
export class RatingNumericalComponent {

  @Input() rating: HydrusNumericalRating

  @Output() ratingSet = new EventEmitter<HydrusNumericalRatingValue>()

  ratingIcons = ratingIcons;
  ratingIconsOutline = ratingIconsOutline;

  constructor() { }

  setRating(value: HydrusNumericalRatingValue) {
    this.ratingSet.emit(value);
  }

}
