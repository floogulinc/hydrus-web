import { Component, EventEmitter, Input, Output } from '@angular/core';
import { HydrusLikeRating, HydrusLikeRatingValue, ratingIcons, ratingIconsOutline } from '../hydrus-rating';

@Component({
  selector: 'app-rating-like',
  templateUrl: './rating-like.component.html',
  styleUrls: ['./rating-like.component.scss']
})
export class RatingLikeComponent {

  @Input() rating: HydrusLikeRating

  @Output() ratingSet = new EventEmitter<HydrusLikeRatingValue>()

  ratingIcons = ratingIcons;
  ratingIconsOutline = ratingIconsOutline;

  constructor() { }

  setRating(value: HydrusLikeRatingValue) {
    this.ratingSet.emit(value);
  }

}
